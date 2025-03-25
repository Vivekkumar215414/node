const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const DATA_FILE = "cars.json";

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Function to read data from file
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
};

// Function to write data to file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

// API to add a new car
app.post("/add-car", (req, res) => {
    const { Make, Model, HorsePower, Color, Price } = req.body;

    if (!Make || !Model || !HorsePower || !Color || !Price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const cars = readData();
    const newCar = { Make, Model, HorsePower, Color, Price };

    cars.push(newCar);
    writeData(cars);

    res.status(201).json({ message: "Car added successfully", car: newCar });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
