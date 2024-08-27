const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

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

// Маршрут для отримання всіх записів з MongoDB з можливістю сортування
app.get('/api/flowdatas', async (req, res) => {
    try {
        const { deviceId, sortBy = 'timestamp', sortOrder = 'asc' } = req.query;

        const query = deviceId ? { device_id: deviceId } : {};
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const flowdatas = await FlowData.find(query).sort(sortOptions);
        res.json(flowdatas);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data from MongoDB' });
    }
});

// Маршрут для отримання даних по конкретному Device ID
app.get('/api/flowdatas/device/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { sortBy = 'timestamp', sortOrder = 'asc' } = req.query;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const flowdatas = await FlowData.find({ device_id: deviceId }).sort(sortOptions);
        res.json(flowdatas);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data from MongoDB' });
    }
});

// Обработка запросов на удаление данных
app.delete('/api/flowdatas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await FlowData.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            res.status(200).send('Deleted successfully');
        } else {
            res.status(404).send('Data not found');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Server error');
    }
});

// Додавання статичних файлів (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json()); // For parsing application/json

app.post('/api/flowdatas', async (req, res) => {
    try {
        const newFlowData = new FlowData(req.body);
        const savedData = await newFlowData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save data to MongoDB' });
    }
});

app.post('/api/flowdatas', async (req, res) => {
    try {
        const newFlowData = new FlowData(req.body);
        const savedFlowData = await newFlowData.save();
        res.status(201).json(savedFlowData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
});

