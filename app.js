const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
    console.log('GET request received for /');
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/registration', async (req, res) => {
    console.log('POST request received for /register');
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User added to database:', newUser);
            console.log('Updated user list:', users);
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            console.log('Email already exists:', req.body.email);
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch(error) {
        console.error('Error during registration:', error);
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    console.log('POST request received for /login');
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let name = foundUser.username;
                console.log('Login successful for user:', name);
                res.send(`<div align ='center'><h2>Login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${name}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                console.log('Invalid email or password');
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        } else {
            console.log('User not found:', req.body.email);
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch(error) {
        console.error('Error during login:', error);
        res.send("Internal server error");
    }
});

server.listen(5501, () => {
    console.log("Server is listening on port: 5501");
});
