require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT;
app.listen(PORT, '192.168.0.22', () => {
    console.log(`Server listening on http://192.168.0.22:${PORT}`);
});