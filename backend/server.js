const express = require('express');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const mongoose = require('mongoose');
const UserRouts = require('./Routes/UserRoutes');
const EventCreatorRoutes = require('./Routes/EventCreaterRoutes');
const { response } = require('express');

const DB_URL = process.env.DB_URL;

app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())
app.set('view engine','ejs');

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(() => console.log("Connected to MongoDB..."))
.catch((error) => console.log("MongoDB Error:\n", error))

app.use(cors());

app.use('/api/user',UserRouts);
app.use('/api/event-creator',EventCreatorRoutes);

app.listen(8080,() => {
    console.log("Server listening on port 8080");
});