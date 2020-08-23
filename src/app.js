const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }



  const tempRepository = repositories[repoIndex];

  if (title) tempRepository.title = title;
  if (url) tempRepository.url = url;
  if (techs) {
    if (!Array.isArray(techs)) return response.status(400).json({ error: 'Techs must be passed in as an array' });
    tempRepository.techs = techs;
  }
  if (likes) {
    return response.status(400).json(tempRepository);
  }

  repositories[repoIndex] = tempRepository;
  return response.json(tempRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repo = repositories[repoIndex];
  repo.likes++;

  repositories[repoIndex] = repo;
  return response.json(repo);
});

module.exports = app;
