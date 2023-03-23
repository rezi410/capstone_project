const uri = "mongodb+srv://dbAdmin:dbAdminPassword@cluster0.antlr.mongodb.net/Blog-Database?retryWrites=true&w=majority";

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const HTTP_PORT = process.env.PORT || 8080;
let User = require('./modules/user-schema');
let Post = require('./modules/post-schema');

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected!");
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
    res.send("Hello Everyone!");
})

app.listen(HTTP_PORT, () => {
    console.log("API listening on: " + HTTP_PORT)
});