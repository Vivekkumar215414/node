const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle POST request
app.post('/send-data', (req, res) => {
    const { name, age, email, password } = req.body;

    console.log('Received Data:');
    console.log(`Name: ${name}`);
    console.log(`Age: ${age}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    res.json({ message: 'Data received successfully', receivedData: req.body });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
