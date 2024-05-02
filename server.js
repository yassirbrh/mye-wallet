const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
const UserRoute = require('./routes/UserRoute');

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    store: redisStore,
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: new Date(Date.now() + 3600000 * 24)
    }
}));

app.use('/api/users', UserRoute);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.status(200).send({message: "Let's goo !!!"})
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => console.log(error))
