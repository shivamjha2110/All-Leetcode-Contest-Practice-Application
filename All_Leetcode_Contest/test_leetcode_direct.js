import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const query = `
    query topTwoContests {
      topTwoContests {
        title
        titleSlug
        startTime
        duration
      }
    }
`;

async function test() {
    try {
        console.log("Testing LeetCode API...");
        const response = await axios.post(
            LEETCODE_API_URL,
            { query, variables: {} },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com/contest/',
                    'Origin': 'https://leetcode.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': '*/*'
                },
            }
        );
        console.log("Success! Data:", response.data);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Error Response Body:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

test();
