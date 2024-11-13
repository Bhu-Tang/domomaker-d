const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");

require('dotenv').config();
const router = require("./router.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI

mongoose.connect(dbURI).catch((err) => {

    if(err)
    {
        console.log('Could not connect to database.')
        throw err;
    }
});

const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(express.urlencoded({urlencoded: true}));
app.use(express.json());
app.use(session({
    key: 'sessionid',
    secret: 'Domo Arigato',
    resave: false,
    saveUninitialized: false,
}));
app.engine('handlebars',expressHandlebars.engine({defaultLayout: ''}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
    if(err) { throw err; }
    console.log(`Listening on port ${port}`);
})