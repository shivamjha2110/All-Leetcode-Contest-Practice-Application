import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leetcode';
const QUERIES = {
    pastContests: `
    query pastContests($pageNo: Int, $numPerPage: Int) {
      pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
        data {
          title
          startTime
        }
        totalNum
      }
    }
  `
};

async function fetchLeetCode(query, variables) {
    try {
        const res = await axios.post(API_URL, { query, variables });
        return res.data.data;
    } catch (err) {
        console.error("Fetch error:", err.message);
        return null;
    }
}

async function run() {
    console.log("Fetching page 1 with 50...");
    const first = await fetchLeetCode(QUERIES.pastContests, { pageNo: 1, numPerPage: 50 });

    if (!first || !first.pastContests) {
        console.error("Failed to fetch first page");
        return;
    }

    const total = first.pastContests.totalNum;
    const p1Count = first.pastContests.data.length;
    console.log(`Total Contests: ${total}`);
    console.log(`Page 1 fetched count: ${p1Count}`);

    // If p1Count is 10, then we are limited.

    if (p1Count < 50) {
        console.log(`WARN: Requested 50 but got ${p1Count}. API likely limits page size.`);
    }

    const realPerPage = p1Count > 0 ? p1Count : 10;
    const totalPages = Math.ceil(total / realPerPage);
    console.log(`Calculated Total Pages (based on ${realPerPage}/page): ${totalPages}`);
}

run();
