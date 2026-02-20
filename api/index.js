const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// In-memory array to store messages (for demo purposes)
const messages = [];

// API Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    messages.push(newMessage);
    console.log('New message received:', newMessage);

    // Simulate successful submission
    setTimeout(() => {
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }, 1000);
});

// API Endpoint to get all messages (for admin/demo purposes)
app.get('/api/messages', (req, res) => {
    res.status(200).json(messages);
});

// Catch-all route to serve the main index.html for any other requests
// This allows the frontend to manage routing if needed later
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Export the app for Vercel's serverless platform
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
module.exports = app;
