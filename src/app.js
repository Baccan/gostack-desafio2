const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRequestId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) return res.status(400).json({ msg: "Invalid Repository id!" })

  return next()
}

app.use('/repositories/:id', validateRequestId)

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body
  
  if (!title || !url || !techs) return res.status(400).json("Invalid request")

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return res.json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const { title, url, techs, likes } = req.body

  const resultIndex = repositories.findIndex(repository => repository.id === id)

  if (resultIndex < 0) return res.status(404).json("Repository not found!")

  if (likes) return res.json({ likes: repositories[resultIndex].likes })

  if (!title || !url) return res.status(400).json("Invalid repository request!")

  repositories[resultIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[resultIndex].likes
  }

  return res.json(repositories[resultIndex])
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const resultIndex = repositories.findIndex(repository => repository.id === id)

  if (resultIndex < 0) return res.status(404).json("Repository not found!")

  repositories.splice(resultIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params

  const resultIndex = repositories.findIndex(repository => repository.id === id)

  if (resultIndex < 0) return res.status(404).json("Repository not found!")

  repositories[resultIndex].likes++;

  return res.json({ likes: repositories[resultIndex].likes })
});

module.exports = app;
