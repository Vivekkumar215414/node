// const express = require("express");
// const bcrypt = require("bcryptjs");
// const session = require("express-session");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 3000;

// // Dummy user (replace with database)
// const users = [{ username: "admin", password: bcrypt.hashSync("password123", 10) }];

// // Middleware
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: true
// }));

// // Routes
// app.get("/", (req, res) => {
//     if (req.session.user) {
//         return res.redirect("/dashboard");
//     }
//     res.render("login", { error: null });
// });

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username);

//     if (!user || !bcrypt.compareSync(password, user.password)) {
//         return res.render("login", { error: "Invalid username or password" });
//     }

//     req.session.user = user;
//     res.redirect("/dashboard");
// });

// app.get("/dashboard", (req, res) => {
//     if (!req.session.user) {
//         return res.redirect("/");
//     }
//     res.render("dashboard", { user: req.session.user });
// });

// app.get("/logout", (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/");
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userAuth', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Pass error as null initially
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = user;
    res.redirect('/dashboard');
});


// Routes
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.send('User already exists');

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.send('Error during signup');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.send('Invalid credentials');
    }

    req.session.user = user;
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('dashboard', { user: req.session.user });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
