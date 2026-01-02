import express from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// LeetCode GraphQL Endpoint
const LEETCODE_API_URL = 'https://leetcode.com/graphql';

app.post('/api/leetcode', async (req, res) => {
    try {
        const { query, variables } = req.body;

        const response = await axios.post(
            LEETCODE_API_URL,
            { query, variables },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://leetcode.com',
                    'Referer': 'https://leetcode.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                },
                httpsAgent: new https.Agent({ keepAlive: true }),
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to LeetCode:', error.message);
        if (error.response) {
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
