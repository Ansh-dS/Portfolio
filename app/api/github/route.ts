import { NextResponse } from 'next/server'

export interface GitHubContributionDay {
  date: string
  count: number
  level: number
  dayOfWeek: number
}

export interface GitHubMonthLabel {
  label: string
  colIndex: number
}

export interface GitHubApiResponse {
  success: boolean
  username: string
  year: number
  totalContributions: number
  activeDays: number
  currentStreak: number
  longestStreak: number
  weeks: (GitHubContributionDay | null)[][]
  monthLabels: GitHubMonthLabel[]
  days: GitHubContributionDay[]
  isLive: boolean
  error?: string
}

function generateFallbackWeeks(year: number): {
  weeks: (GitHubContributionDay | null)[][]
  monthLabels: GitHubMonthLabel[]
  days: GitHubContributionDay[]
} {
  const weeks: (GitHubContributionDay | null)[][] = []
  const days: GitHubContributionDay[] = []
  const monthLabels: GitHubMonthLabel[] = []
  const today = new Date()

  // First Sunday of the year (or prior Sunday)
  const cursor = new Date(year, 0, 1)
  const startDayOfWeek = cursor.getDay()
  cursor.setDate(cursor.getDate() - startDayOfWeek)

  let lastMonth = -1

  for (let w = 0; w < 52; w++) {
    const week: (GitHubContributionDay | null)[] = []
    for (let d = 0; d < 7; d++) {
      const month = cursor.getMonth()
      if (month !== lastMonth && d === 0 && cursor.getFullYear() === year) {
        monthLabels.push({
          label: cursor.toLocaleString('default', { month: 'short' }),
          colIndex: w,
        })
        lastMonth = month
      }

      const dateStr = cursor.toISOString().slice(0, 10)
      const count = cursor > today ? 0 : (w * 7 + d * 3 + 1) % 5
      const level =
        count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4
      const dayObj: GitHubContributionDay = {
        date: dateStr,
        count,
        level,
        dayOfWeek: d,
      }
      week.push(dayObj)
      if (cursor <= today) days.push(dayObj)

      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return { weeks, monthLabels, days }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username =
    searchParams.get('username') || process.env.GITHUB_USERNAME || 'Ansh-dS'
  const currentYear = new Date().getFullYear()

  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${currentYear}-01-01&to=${currentYear}-12-31`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://github.com)',
        },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub returned status ${response.status}`)
    }

    const html = await response.text()

    // 1. Parse Month labels from thead
    const theadMatch = html.match(/<thead>([\s\S]*?)<\/thead>/)
    const monthLabels: GitHubMonthLabel[] = []
    if (theadMatch) {
      let colPos = 0
      const monthTds = [
        ...theadMatch[1].matchAll(
          /<td[^>]*colspan="(\d+)"[^>]*>[\s\S]*?<span aria-hidden="true"[^>]*>([^<]+)<\/span>/g
        ),
      ]
      for (const m of monthTds) {
        const colspan = parseInt(m[1], 10)
        const label = m[2]
        monthLabels.push({ label, colIndex: colPos })
        colPos += colspan
      }
    }

    // 2. Parse Rows from tbody (7 rows: 0 = Sun, 1 = Mon, ..., 6 = Sat)
    const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/)
    const rowMatches = tbodyMatch
      ? [...tbodyMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
      : []

    let maxIx = 52
    const cellMap = new Map<string, GitHubContributionDay>()

    for (let r = 0; r < 7; r++) {
      const row = rowMatches[r]
      if (!row) continue

      const tdElements = row[1].matchAll(/<td\b([^>]*)>/g)

      for (const tdMatch of tdElements) {
        const attrs = tdMatch[1]
        const ixMatch = attrs.match(/data-ix="(\d+)"/)
        const dateMatch = attrs.match(/data-date="([^"]+)"/)
        const idMatch = attrs.match(/id="([^"]+)"/)
        const levelMatch = attrs.match(/data-level="([^"]+)"/)
        if (!dateMatch) continue

        const colIx = ixMatch ? parseInt(ixMatch[1], 10) : 0
        if (colIx > maxIx) maxIx = colIx

        const date = dateMatch[1]
        const id = idMatch ? idMatch[1] : ''
        const level = levelMatch ? parseInt(levelMatch[1], 10) || 0 : 0

        const tooltipMatch = html.match(
          new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>(.*?)<\\/tool-tip>`)
        )
        let count = 0
        if (tooltipMatch) {
          const countMatch = tooltipMatch[1].match(/^(\d+)\s+contribution/)
          if (countMatch) count = parseInt(countMatch[1], 10)
        }

        cellMap.set(`${colIx},${r}`, {
          date,
          count,
          level,
          dayOfWeek: r,
        })
      }
    }

    if (cellMap.size === 0) {
      throw new Error('No contribution cells parsed from GitHub HTML')
    }

    // 3. Assemble weeks grid accurately indexed by data-ix (0 to maxIx)
    const weeks: (GitHubContributionDay | null)[][] = []
    const allDays: GitHubContributionDay[] = []

    for (let c = 0; c <= maxIx; c++) {
      const week: (GitHubContributionDay | null)[] = []
      for (let r = 0; r < 7; r++) {
        const day = cellMap.get(`${c},${r}`) ?? null
        week.push(day)
        if (day) allDays.push(day)
      }
      weeks.push(week)
    }

    allDays.sort((a, b) => a.date.localeCompare(b.date))

    const totalContributions = allDays.reduce((sum, d) => sum + d.count, 0)
    const activeDays = allDays.filter((d) => d.count > 0).length

    const todayStr = new Date().toISOString().slice(0, 10)
    const pastDays = allDays.filter((d) => d.date <= todayStr)

    // Calculate streaks
    let longestStreak = 0
    let tempStreak = 0

    for (const day of pastDays) {
      if (day.count > 0) {
        tempStreak++
        if (tempStreak > longestStreak) longestStreak = tempStreak
      } else {
        tempStreak = 0
      }
    }

    let currentStreak = 0
    for (let i = pastDays.length - 1; i >= 0; i--) {
      if (pastDays[i].count > 0) {
        currentStreak++
      } else {
        if (i === pastDays.length - 1) continue // today grace
        break
      }
    }

    return NextResponse.json<GitHubApiResponse>(
      {
        success: true,
        username,
        year: currentYear,
        totalContributions,
        activeDays,
        currentStreak,
        longestStreak,
        weeks,
        monthLabels,
        days: allDays,
        isLive: true,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching GitHub live data:', error)
    const { weeks, monthLabels, days } = generateFallbackWeeks(currentYear)
    const totalContributions = days.reduce((sum, d) => sum + d.count, 0)

    return NextResponse.json<GitHubApiResponse>({
      success: false,
      username,
      year: currentYear,
      totalContributions,
      activeDays: days.filter((d) => d.count > 0).length,
      currentStreak: 7,
      longestStreak: 7,
      weeks,
      monthLabels,
      days,
      isLive: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
