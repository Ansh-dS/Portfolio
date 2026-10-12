import { NextResponse } from 'next/server'

export interface LeetCodeApiResponse {
  success: boolean
  username: string
  rating: number
  profileRanking: number | null
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  attendedContests: number
  primaryLanguage: string
  profileUrl: string
  isLive: boolean
  error?: string
}

const FALLBACK_STATS: Omit<
  LeetCodeApiResponse,
  'username' | 'success' | 'isLive'
> = {
  rating: 1460,
  profileRanking: 3711622,
  totalSolved: 25,
  easySolved: 10,
  mediumSolved: 12,
  hardSolved: 3,
  attendedContests: 5,
  primaryLanguage: 'C++',
  profileUrl: 'https://leetcode.com/u/0hUybs2mus/',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username =
    searchParams.get('username') ||
    process.env.LEETCODE_USERNAME ||
    '0hUybs2mus'

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://leetcode.com)',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
            userContestRanking(username: $username) {
              rating
              globalRanking
              attendedContestsCount
            }
          }
        `,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL responded with ${response.status}`)
    }

    const json = await response.json()
    const user = json?.data?.matchedUser
    const contest = json?.data?.userContestRanking

    if (!user) {
      return NextResponse.json<LeetCodeApiResponse>(
        {
          success: true,
          username,
          ...FALLBACK_STATS,
          isLive: false,
        },
        {
          headers: {
            'Cache-Control':
              'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      )
    }

    const subCounts = user.submitStatsGlobal?.acSubmissionNum || []
    const totalSolved =
      subCounts.find((s: { difficulty: string }) => s.difficulty === 'All')
        ?.count ?? FALLBACK_STATS.totalSolved
    const easySolved =
      subCounts.find((s: { difficulty: string }) => s.difficulty === 'Easy')
        ?.count ?? FALLBACK_STATS.easySolved
    const mediumSolved =
      subCounts.find((s: { difficulty: string }) => s.difficulty === 'Medium')
        ?.count ?? FALLBACK_STATS.mediumSolved
    const hardSolved =
      subCounts.find((s: { difficulty: string }) => s.difficulty === 'Hard')
        ?.count ?? FALLBACK_STATS.hardSolved

    const rating = Math.round(contest?.rating ?? FALLBACK_STATS.rating)
    const attendedContests =
      contest?.attendedContestsCount ?? FALLBACK_STATS.attendedContests
    const profileRanking =
      user.profile?.ranking ?? FALLBACK_STATS.profileRanking

    return NextResponse.json<LeetCodeApiResponse>(
      {
        success: true,
        username,
        rating,
        profileRanking,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        attendedContests,
        primaryLanguage: 'C++',
        profileUrl: `https://leetcode.com/u/${username}/`,
        isLive: true,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching LeetCode live data:', error)
    return NextResponse.json<LeetCodeApiResponse>({
      success: false,
      username,
      ...FALLBACK_STATS,
      isLive: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
