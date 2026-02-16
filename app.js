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

// MongoDB Connection Logic
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'deepsea';

const mongoURI = MONGO_USER && MONGO_PASS
    ? `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?authSource=admin`
    : `mongodb://${MONGO_HOST}/${MONGO_DB}`;

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to Deep Sea Database'))
    .catch(err => console.error('Abyssal Connection Error:', err));

// Mongoose Schema & Model
const speciesSchema = new mongoose.Schema({
    name: String,
    depth: String,
    status: String
});

const Species = mongoose.model('Species', speciesSchema);

// Initial Seed Method (Internal)
async function seedDatabase() {
    const count = await Species.countDocuments();
    if (count === 0) {
        await Species.create([
            { name: 'Giant Squid', depth: '1000m', status: 'Mysterious' },
            { name: 'Anglerfish', depth: '2000m', status: 'Predatory' },
            { name: 'Dumbo Octopus', depth: '3000m', status: 'Cute' }
        ]);
        console.log('Seeded Abyss with initial species.');
    }
}
seedDatabase();

// Routes
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

// Port Execution
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Deep Sea Explorer listening at http://localhost:${port}`);
    });
}

module.exports = app;
