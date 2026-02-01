const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('🎉 Celebrate Hub API is running!');
});

// Mock Data for MVP (until Database is connected)
const services = [
    { id: 1, name: 'قاعة السرايا', type: 'venue', location: 'Hail', price: 15000 },
    { id: 2, name: 'بوفيه الأرجوان', type: 'catering', location: 'Hail', price: 5000 },
    { id: 3, name: 'تنظيم إبداع', type: 'planner', location: 'Hail', price: 3000 }
];

app.get('/api/services', (req, res) => {
    res.json(services);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
