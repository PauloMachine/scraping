const cheerio = require("cheerio");
const _ = require('lodash');

// Api
const api = require('../services/api');

// Urls
const { urlInfoUniversities, urlLinkUniversities } = require('../config/url');

module.exports = {

   // Função para pegar as universities
   async findAll(req, res) {

      // Reponsável por gerar a informações principais
      async function info() {
         // Instância array
         const arrUniversities = [];
         await api.get(urlInfoUniversities)
         .then(urlResponse => {
            const $ = cheerio.load(urlResponse.data);
            // Procura com a provincia BC
            $('#bc > table > tbody > tr > td:first-child')
            .each((index, element) => {
               const campuses = $(element).text();
               arrUniversities[index] = {campuses}
            });   
            // Procura com a provincia ON
            $('#on > table > tbody > tr > td:first-child')
            .each((index, element) => {
               const campuses = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], campuses}
            });   
            // Procura o numero BC
            $('#bc > table > tbody > tr > td:nth-child(2)').each((index, element) => {
               const number = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], number}
            });   
            // Procura o numero ON
            $('#on > table > tbody > tr > td:nth-child(2)').each((index, element) => {
               const number = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], number}
            });   
            // Procura a cidade BC
            $('#bc > table > tbody > tr > td:nth-child(3)').each((index, element) => {
               const city = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], city}
            });
            // Procura a cidade ON
            $('#on > table > tbody > tr > td:nth-child(3)').each((index, element) => {
               const city = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], city};
            });
         }).catch(err => {
            throw new Error('There was an error looking up the information: ', err);
         }); 
         // Retornando array único formatado
         return _.uniqBy(arrUniversities, 'campuses');
      }

      // Reponsável por gerar os links
      async function link() {
         // Instância array
         const arrUniversities = [];
         await api.get(urlLinkUniversities)
         .then(async urlResponse => {
            const $ = cheerio.load(urlResponse.data);
            // Procura o nome
            $('#example > tbody > tr > td:first-child').each((index, element) => {
               const campuses = $(element).text();
               arrUniversities[index] = {campuses}
            });   
            // Procura a pronvicia
            $('#example > tbody > tr > td:nth-child(4)').each((index, element) => {
               const province = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], province}
            });   
            // Procura o link
            await $('#example > tbody > tr > td > a').each(async (index, element) => {
               const link = $(element).text();
               arrUniversities[index] = {...arrUniversities[index], link}
            })
         }).catch(err => {
            throw new Error('An error occurred while looking for additional attributes', err);
         }); 
         // Retornando array único formatado
         // Retornando apenas as duas provincias
         return _.uniqBy(arrUniversities.filter(el => {
            if (el.province === 'Ontario' || 
               el.province === 'British Columbia') {
               return el;
            }
         }), 'campuses');
      }
      
      // Reponsável por achar os titles das pages
      async function title(universities) {
         let index = 0;
         for await(universitie of universities) {
            // Solicitado para nesta task pegar somente 20 links
            if (index < 20) {
               await api.get(universitie.link).then((urlResponse) => {
                  const $ = cheerio.load(urlResponse.data);
                  // Procura o titulo
                  $('head > title').each((index, element) => {
                     let title = $(element).text().trim();
                     // Caso não tenha titulo tenta atribuir a tag description
                     if (title === null) {
                        title = $("meta[property='og:description']").attr("content").trim();
                     }
                     // Se continuar sem valor recebe como default Not Found
                     if (title === null) {
                        title = "Not found";
                     }
                     // Retorna titulo
                     universities[index] = {...universities[index], title}
                  });
               }).catch(() => {
                  // Retorna titulo como não encontrado
                  universities[index] = {...universities[index], title: "Not found"};
               }); 
            } else {
               // Se ja pesquisou 20 sites é estourando o máximo permitido (task final)
               universities[index] = {...universities[index], title: "Maximum of 20 links reached"};
            }
            index += 1;     
         };
         // Retorna array formatado
         return universities;
      }
      
      // Garante a execução de todas as funções antes de fazer o map 
      let result = await Promise.all([link(), info()]);
      // Instância array
      const universities = [];
      // Percorre os dois arrays juntando ao encontrar campuses com nomes iguais é atribuido o valor do link
      await result[0].map(async (info, i) => {
         await result[1].map((add) => {
            if (add.campuses === info.campuses) {
               // Instancia novos campos
               let link = add.link;
               // Define novos campos
               info[i] = {...info[i], link};
               // Gera novo array 
               universities.push(info);
            }                
         });
      });
      // Procura os titulos da pagina
      result = await Promise.all([title(universities)]);
      // Retorna o json formatado
      res.json(result[0]);
   }
}

