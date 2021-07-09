// Main Dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

// Sub Dependencies
const app = express();

// Custom Dependencies
const { generateCode } = require("./server_modules/utilities");
const { newCanvas } = require("./server_modules/canvasHandler");
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


app.post("/jam/create", (req, res) => {
  if (req.headers['content-type'] !== "application/json") return res.status(404).send("Content-Type must be of value 'application/json'");

  const newJam = new Jam(req.body.name, {
    public: req.body.public,
    width: req.body.width,
    height: req.body.height
  }, jams);

  res.status(200).send({jamID: newJam.id, hostKey: newJam.hostKey});
})

app.post("/jam/edit", (req, res) => {
  if (!req.headers['authorization']) return res.sendStatus(401);

  var authHeader = req.headers['authorization'].split(" ");
  const jam = jams.listJams({hostKey: authHeader[1], id: authHeader[0]});

  if (jam.length <= 0) return res.sendStatus(401);
  
  if (req.body) jams.editJam(jam[0].id, req.body);
  const outJam = jams.listJams({id: jam[0].id})[0];

  res.status(200).send({
    name: outJam.name,
    id: outJam.id,
    width: outJam.width,
    height: outJam.height
  });
})

app.get("/jam/list", (req, res) => {
  const filteredJams = jams.listJams({public: true});
  var out = [];
  for (const jam of filteredJams) {
    out.push({
      name: jam.name,
      id: jam.id,
      width: jam.width,
      height: jam.height
    })
  }
  res.status(200).send(out);
})

app.listen(port, () => console.log("Server is listening on port: " + port));

// ~Functions~

