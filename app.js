require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================
// MongoDB Atlas Connection
// ============================

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is missing!');
    console.error('Please configure MONGO_URI in the environment or Jenkins credentials.');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('✅ Connected to Deep Sea Database');
})
.catch(err => {
    console.error('CRITICAL: Abyssal Connection Error:', err.message);
    console.error('Exiting due to failed database connection.');
    process.exit(1);
});

// ============================
// Mongoose Schema & Model
// ============================

const speciesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    depth: { type: String, required: true },
    status: { type: String, required: true }
});

const Species = mongoose.model('Species', speciesSchema);

// ============================
// Initial Seed Logic
// ============================

async function seedDatabase() {
    try {
        const count = await Species.countDocuments();
        if (count === 0) {
            await Species.insertMany([
                { name: 'Giant Squid', depth: '1000m', status: 'Mysterious' },
                { name: 'Anglerfish', depth: '2000m', status: 'Predatory' },
                { name: 'Dumbo Octopus', depth: '3000m', status: 'Cute' }
            ]);
            console.log('🌊 Seeded Abyss with initial species.');
        }
    } catch (err) {
        console.error('Seeding error:', err.message);
    }
}

mongoose.connection.once('open', seedDatabase);

// ============================
// Routes
// ============================

app.get('/species', async (req, res) => {
    try {
        const data = await Species.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Abyssal error fetching species' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('Submarine Systems Operational');
});

// ============================
// Server Start
// ============================

if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Deep Sea Explorer listening at http://localhost:${port}`);
    });
}

module.exports = app;
