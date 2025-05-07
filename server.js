require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch wallpapers
app.get('/api/wallpapers', async (req, res) => {
    try {
        const { query = 'nature', page = 1, perPage = 20 } = req.query;
        
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: process.env.PIXABAY_API_KEY,
                q: query,
                page: page,
                per_page: perPage,
                image_type: 'photo',
                orientation: 'horizontal',
                min_width: 1920,
                min_height: 1080,
                safesearch: true
            }
        });
        
        res.json(response.data.hits);
    } catch (error) {
        console.error('Error fetching wallpapers:', error);
        res.status(500).json({ error: 'Failed to fetch wallpapers' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});