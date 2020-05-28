const Clarifai = require("clarifai");

const app = new Clarifai.App({ apiKey: "ad61703ede7f44dc9ca639dafc0b90d8" });

const handleAPICall = (req, res) => {
  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Unable to work with api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage,
  handleAPICall,
};
