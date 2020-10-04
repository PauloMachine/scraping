// Jsons formatados
const infoBritishColumbia = require('../json/InfoBritishColumbia.json');
const linkBritishColumbia = require('../json/LinkBritishColumbia.json');
const infoOntario = require('../json/InfoOntario.json');
const linkOntario = require('../json/LinkOntario.json');

// Controller responsável por criar o json
module.exports = {
   async findAll(req, res) {
      // Instancia array de universities
      const universities = [];
      // Cria json de BC mapeando o campuses para obter o link
      infoBritishColumbia.map((info) => {linkBritishColumbia.map((link) => {
            if (info.campuses === link.campuses){
               info.link = link.link;
               universities.push(info);
            }
         })
      })
      // Cria json de ON mapeando o campuses para obter o link
      infoOntario.map((info) => {linkOntario.map((link) => {
            if (info.campuses === link.campuses){
               info.link = link.link;
               universities.push(info);
            }
         })
      })
      // Retorna array com todas as universities
      return res.json(universities);
   },

   async findbyBritishColumbia(req, res) {
      // Instancia array de universities
      const universities = [];
      // Cria json de BC mapeando o campuses com o link
      infoBritishColumbia.map((info) => {linkBritishColumbia.map((link) => {
            if (info.campuses === link.campuses){
               info.link = link.link;
               universities.push(info);
            }
         })
      })
      // Retorna array do BC
      return res.json(universities)
   },

   async findbyOntario(req, res) {
      // Instancia array de universities
      const universities = [];
      // Cria json de ON mapeando o campuses com o link
      infoOntario.map((info) => {linkOntario.map((link) => {
            if (info.campuses === link.campuses){
               info.link = link.link;
               universities.push(info);
            }
         })
      })
      // Retorna array do ON
      return res.json(universities)
   },
}