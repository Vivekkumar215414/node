const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware for JSON parsing

// Sample Data (In-memory database)
let users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// Add a new user
app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name;
    res.json(user);
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: "User deleted" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
