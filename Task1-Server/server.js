const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/waterflow')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Створення схеми для колекції
const flowDataSchema = new mongoose.Schema({
    timestamp: Number,
    device_id: String,
    location: String,
    flow_rate: Number,
    water_temperature: Number,
    pressure: Number,
    status: String,
    units: String,
    calibration: Number
});

const FlowData = mongoose.model('FlowData', flowDataSchema);

// Функція для збереження даних з CSV до MongoDB
async function saveCSVToMongoDB(filePath) {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            try {
                const newFlowData = new FlowData(row);
                await newFlowData.save();
                console.log('Data saved:', row);
            } catch (err) {
                console.error('Error saving data:', err);
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed and data saved to MongoDB.');
        });
}

// Завантаження даних з CSV
saveCSVToMongoDB('./Server/data/water_data.csv');

// Старт сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
