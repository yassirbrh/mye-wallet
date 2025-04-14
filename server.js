const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
import RedisStore from 'connect-redis';
import redisClient from './cache/redisClient';
import redisAdmin from './cache/redisAdmin';
const UserRoute = require('./routes/UserRoute');
const RequestRoute = require('./routes/RequestRoute');
const AdminRoute = require('./routes/AdminRoute');

// Main application management
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));


// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'userconnect.sid',
    store: redisStore,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    rolling: true, // Refresh expiration time on user activity
    cookie: {
        maxAge: 3600000 * 24 // Set a fixed expiration time
    }
}));

process.on('SIGINT', async () => {
    await redisClient.quit();
    console.log('Redis client disconnected');
    process.exit(0);
});

// application endpoints
app.use('/api/users', UserRoute);
app.use('/api/requests', RequestRoute);
// end of app endpoints

// Application admin management

const admin = express();

admin.use(express.json());
admin.use(cookieParser());
admin.use(cors({
    origin: true,
    credentials: true
}));

// Initialize store.
let redisAdminStore = new RedisStore({
  client: redisAdmin,
  prefix: "myapp:",
})

admin.use(bodyParser.urlencoded({ extended: true }));
admin.use(session({
    name: 'adminconnect.sid',
    store: redisAdminStore,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 3600000 * 24
    }
}));

admin.use('/api/admin', AdminRoute);

const PORT = process.env.PORT || 5000;
const ADMIN_PORT = process.env.ADMIN_PORT || 5001

app.get('/', (req, res) => {
    res.status(200).send({message: "Let's goo !!!"})
});

admin.get('/', (req, res) => {
    res.status(200).send({message: "Let's goo admin !!"});
})

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        admin.listen(ADMIN_PORT, () => {
            console.log(`Admin Server running on port ${ADMIN_PORT}`);
        })
    })
    .catch((error) => console.log(error))
