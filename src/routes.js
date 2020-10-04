const { Router } = require('express');

// Controller
const UniversitiesController = require("./controllers/UniversitiesController");

const routes = new Router();

routes.get("/", UniversitiesController.findAll);
routes.get("/universities/bc", UniversitiesController.findbyBritishColumbia);
routes.get("/universities/on", UniversitiesController.findbyOntario);

module.exports = routes;