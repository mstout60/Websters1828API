var express = require('express');
var fs = require("fs");
const path = require('path')
var app = express();
const port = 4000;

app.get('/', async (req, res) => {
    res.send({ word: "Not Found", pronunciation: "NOT'FOUND", definition: { type: "error", text: "Word '' is not in this dictionary." } })
})

app.get('/:word', async (req, res) => {
    var word = req.params.word.charAt(0).toUpperCase() + req.params.word.slice(1);
    await fs.readFile(`./src/words/${word[0]}/${word}.json`, function (err, data) {
        if (err) {
            data = { word: "Not Found", pronunciation: "NOT'FOUND", definition: { type: "error", text: `Word '${req.params.word}' is not in this dictionary.` } }
        }
        else {
            data = JSON.parse(data);
        }
        res.send(data)
    });
})

app.get('/load/:load', async (req, res) => {
    var load = req.params.load.charAt(0).toUpperCase() + req.params.load.slice(1);

    const jsonInDir = fs.readdirSync(`./src/words/${load[0]}`).filter(file => path.extname(file) === '.json');

    let data = [];
    jsonInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join(`./src/words/${load[0]}`, file));
        data.push(JSON.parse(fileData))
    });

    res.send(data)
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

