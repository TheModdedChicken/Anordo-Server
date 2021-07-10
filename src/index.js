// Main Dependencies
const { ExpressPeerServer } = require('peer');
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

// Sub Dependencies
const app = express();

// Custom Dependencies
const { generateCode } = require("./server_modules/utilities");
const Jam = require("./server_modules/Jam");
const JamManager = require("./server_modules/JamManager");


// Server Variables
const port = process.env.PORT || 4000;
var jams = new JamManager("mainJamManager");


// ~Endpoints~
app.use(cors({origin: "*"}))
app.use(express.json());

app.get("/", (req, res) => {
  res.status(404).send("Can't really help you out here");
})

// Public

app.post("/jam/create", (req, res) => {
  if (req.headers['content-type'] !== "application/json") return res.status(404).send("Content-Type must be of value 'application/json'");

  const newJam = new Jam({
    name: req.body.name,
    hostID: req.body.hostID,
    description: req.body.description,
    public: req.body.public,
    width: req.body.width,
    height: req.body.height
  }, jams);

  res.status(200).send({jamID: newJam.id, hostKey: newJam.hostKey});
})

app.get("/jam/list", (req, res) => {
  const filteredJams = jams.listJams({public: true});
  var out = [];
  for (const jam of filteredJams) {
    out.push({
      name: jam.name,
      description: jam.description,
      id: jam.id,
      hostID: jam.hostID,
      width: jam.width,
      height: jam.height,
      public: jam.public,
    })
  }
  res.status(200).send(out);
})

// Protected

app.post("/jam/edit", (req, res) => {
  if (!req.headers['authorization']) return res.sendStatus(401);

  var authHeader = req.headers['authorization'].split(" ");
  console.log({hostKey: authHeader[1], id: authHeader[0]});
  const jam = jams.listJams({hostKey: authHeader[1], id: authHeader[0]});

  if (jam.length <= 0) return res.sendStatus(401);
  
  if (req.body) jams.editJam(jam[0].id, req.body);
  const outJam = jams.listJams({id: jam[0].id})[0];

  res.status(200).send({
    name: outJam.name,
    description: outJam.description,
    id: outJam.id,
    hostID: outJam.hostID,
    width: outJam.width,
    height: outJam.height,
    public: outJam.public,
  });
})

var server = app.listen(port, () => console.log("Server is listening on port: " + port));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true
});
app.use('/peer', peerServer);

peerServer.on('connection', (id) => {
  //console.log(id)
  //console.log(server.connections)
});