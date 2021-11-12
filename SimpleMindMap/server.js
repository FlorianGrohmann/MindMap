//app.use(bodyParser.urlencoded({extended : true}));
//app.use('/changeBackgroundColor', bodyParser.text());
const express = require("express");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/MindMap', async function(req, res) {
    res.sendFile(__dirname + "/" + "MindMap.html");
});

app.get('/MindMap.css', async function(req, res) {
    res.sendFile(__dirname + "/" + "MindMap.css");
});

app.get('/MindMap.js', async function(req, res) {
    res.sendFile(__dirname + "/" + "MindMap.js");
});
app.get('/favicon.png', async function(req, res) {
    res.sendFile(__dirname + "/" + "favicon.png");
});
app.get('/sw.js', async function(req, res) {
    res.sendFile(__dirname + "/" + "sw.js");
});
app.get('/jquery-3.6.0.min.js', async function(req, res) {
    res.sendFile(__dirname + "/" + "jquery-3.6.0.min.js");
});
app.get('/raleway-v22-latin-200.woff2', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-200.woff2");
});
app.get('/raleway-v22-latin-200.woff', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-200.woff");
});
app.get('/raleway-v22-latin-300.woff2', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-300.woff2");
});
app.get('/raleway-v22-latin-300.woff', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-300.woff");
});
app.get('/raleway-v22-latin-regular.woff2', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-regular.woff2");
});
app.get('/raleway-v22-latin-regular.woff', async function(req, res) {
    res.sendFile(__dirname + "/" + "raleway-v22-latin-regular.woff");
});
var lastChange;
var count;
var map = new Map();

function loadMap() {
    var file = fs.readFileSync(path.join(__dirname, '/Nodes.txt'), 'UTF-8');
    const lines = file.split(/\r?\n/);
    lastChange = lines[0];
    lines.splice(0, 1);
    count = lines[0];
    lines.splice(0, 1);
    lines.forEach(function(line) {
        if (line != "") {
            var node = JSON.parse(line);
            map.set(node.id, node);
        }
    });
}

function saveMap() {
    var file = fs.createWriteStream(path.join(__dirname, '/Nodes.txt'));
    file.write(lastChange + '\n');
    file.write(count + '\n');
    map.forEach(function(value, key) {
        file.write(JSON.stringify(value) + '\n');
    });
    file.end();
}

function updateMap(node, action) {
    if (action == "set") {
        map.set(node.id, node);
    }
    if (action == "delete") {
        map.delete(node.id);
    }
    if (action == "change") {
        map.delete(node.id);
        map.set(node.id, node);
    }
}

app.route('/getLastChange').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    loadMap();
    res.write(lastChange);
    res.end();
});
app.route('/getCounter').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(count);
    res.end();
});
app.route('/getMap').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    map.forEach(function(value) {
        res.write(JSON.stringify(value) + '\n');
    });
    res.end();
});
app.use('/saveMap', bodyParser.text());
app.route('/saveMap').post((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var data = JSON.parse(req.body);

    lastChange = data[0].lastChange;
    count = data[1].counter;

    map.clear();

    for (var i = 2; i < data.length; i++) {
        updateMap(data[i], "change");
    }
    saveMap();
    res.write("true");
    res.end();
});

app.listen(9999, "127.0.0.1")