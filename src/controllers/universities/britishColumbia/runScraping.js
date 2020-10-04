const infoBritishColumbia = require('./information');
const linkBritishColumbia = require('./link');

// Chamada das funções de scraping do BC
Promise.all([infoBritishColumbia(), linkBritishColumbia()]);