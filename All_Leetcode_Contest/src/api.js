export async function fetchLeetCode(query, variables = {}) {
  try {
    const res = await fetch('/api/leetcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("API Error", err);
    return null;
  }
}

export const QUERIES = {
  userProfile: `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          userAvatar
          realName
          ranking
          reputation
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        contest {
          startTime
        }
      }
    }
  `,
  contestUpcoming: `
    query upcomingContests {
      topTwoContests {
        title
        titleSlug
        startTime
        duration
      }
    }
  `,
  pastContests: `
    query pastContests($pageNo: Int, $numPerPage: Int) {
  pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
        data {
      title
      titleSlug
      startTime
    }
    totalNum
  }
}
`
};
