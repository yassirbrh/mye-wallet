const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.status(200).send({message: "Let's goo !!!"})
})

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => console.log(error))
