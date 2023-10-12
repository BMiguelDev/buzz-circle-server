require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const connectToDB = require('./config/dbConnection');

const PORT = process.env.PORT || 3500;

connectToDB();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());    // We are using this middleware to work with cookies (to handle the refresh token that is stored as a httpOnly cookie)

app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/users', require('./routes/api/users'));
app.use('/posts', require('./routes/api/posts'));

app.all('*', (req, res) => {
    res.status(404);
    // Setting different responses based on the request's content type
    if(req.accepts('html')) { 
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
})

// Custom middleware error handling
app.use(errorHandler);

// We only want to listen for requests if we have succesfully connected to the database
mongoose.connection.once('open', () => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
