const { Router } = require('express');
const routes = new Router();

// Controller
const UniversitiesController = require("./controllers/UniversitiesController");

// Rotas
routes.get("/", UniversitiesController.findAll);

module.exports = routes;