const axios = require("axios");

const api = axios.create({
   baseURL: '',
   timeout: 10000 
});

module.exports = api;
