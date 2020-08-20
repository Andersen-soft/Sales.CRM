require('dotenv').config();

const path = require('path');
const express = require('express');

const ROOT_PATH = process.cwd();
const PUBLIC_PATH = path.join(ROOT_PATH, 'public');
const MAIN_ENTRY_PATH = path.join(PUBLIC_PATH, 'index.html');
const { PORT } = process.env;

const app = express();

app.use(express.static(PUBLIC_PATH));

// Use main file as fallback. App handles specified route by itself, on client side
app.get('*', (req, res) => {
    res.sendFile(MAIN_ENTRY_PATH);
});

app.listen(PORT, () => {
    console.log(`Server starting! on http://localhost:${PORT}`);
});
