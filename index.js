const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')
const TaskRoutes = require('./routes/TaskRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api', TaskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});