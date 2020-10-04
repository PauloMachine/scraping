const infoOntario = require('./information');
const linkOntario = require('./link');

// Chamada das funções de scraping do ON
Promise.all([infoOntario(), linkOntario()]);