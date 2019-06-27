const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let requestsCounter = 0;

// Middleware

function checkIdProject(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  if (index < 0) {
    return res.status(400).json({ error: "Project not found!" });
  }

  req.index = index;

  return next();
}

function counterOfRequests(req, res, next) {
  requestsCounter++;

  console.log(`Number of requests: ${requestsCounter}`);

  return next();
}

server.get("/projects", counterOfRequests, (req, res) => {
  return res.json(projects);
});

server.post("/projects", counterOfRequests, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", counterOfRequests, checkIdProject, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.json(projects[req.index]);
});

server.delete(
  "/projects/:id",
  counterOfRequests,
  checkIdProject,
  (req, res) => {
    projects.splice(req.index, 1);

    return res.send();
  }
);

server.post(
  "/projects/:id/tasks",
  counterOfRequests,
  checkIdProject,
  (req, res) => {
    const { title } = req.body;

    projects[req.index].tasks.push(title);

    return res.json(projects[req.index]);
  }
);

server.listen(3000);
