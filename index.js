const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*";
const API_KEY = process.env.JUDGE0_API_KEY;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/submit', async (req, res) => {
    const { language_id, source_code, stdin } = req.body;
    try {
        const response = await axios.post(JUDGE0_URL, { language_id, source_code, stdin }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });
        console.log(response.data);

        const token = response.data.token;
        const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });
        console.log(resultResponse.data);

        res.json(resultResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
console.log("hello");
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
