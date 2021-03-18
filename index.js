const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const app = express();
require('./routes/pokemon.routes.js')(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.listen(port, () => console.log(`Server running on Port ${port}`));
