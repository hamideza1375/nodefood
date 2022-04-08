const express = require("express");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const mongoose = require('mongoose');
const expressLayout = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config/config.env" });
const { setHeaders } = require("./middleware/headers");
const Food = require("./router/FoodRouter");
const User = require("./router/UserRouter");

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setHeaders);
app.use(express.static("public"));
app.use(express.static("node_modules"));


app.use(expressLayout);
app.set('view engine', 'ejs');
app.set("layout", "./mainLayout");
app.set('views', './views');


app.use(fileUpload());


app.use(Food)
app.use(User)

app.use((req, res) => {
    res.send("<h1 style='text-align:center;color:red; font-size:55px'> 404 </h1>");
});



// const PORT = process.env.PORT || 80;
const PORT = 80;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


mongoose.connect(
    "mongodb+srv://rezahami:1234512345@cluster0.vsfm0.mongodb.net/nodefood3?retryWrites=true&w=majority",
    {
        useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('db connected'))
    .catch((err) => console.error('db not connected', err));


