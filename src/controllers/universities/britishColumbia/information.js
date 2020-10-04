const puppeteer = require('puppeteer');
const fs = require('fs');

// URL das informações  
const { urlInfoUniversities } = require('../../../config/url');

// Busca pela universidade específica
const infoBritishColumbia = (async function infoBritishColumbia() {
   // Abre a página
   const browser = await puppeteer.launch();
   // Nova página
   const page = await browser.newPage();
   // Vai até a página
   await page.goto(urlInfoUniversities);
   // Pega tudo que está dentro do id BC
   const infoArray = await page.evaluate(() => {
         const nodeList = document.querySelectorAll('#bc table tbody tr')
         const infoArray = [...nodeList]
         // Cria estrutura do json
         const infoList = infoArray.map((tr) => ({
            province: 'British Columbia',
            city: tr.children[2].innerText,
            campuses: tr.children[0].innerText,
            number: tr.children[1].innerText,
            link: null,
         }))
         // Retorna json 
         return infoList;
   });
   // Reescrevendo arquivo
   fs.writeFile('./src/json/InfoBritishColumbia.json', JSON.stringify(infoArray, null, 2), err => {
      if (err) throw new Error('There was an error in information British Columbia', err);
      console.log('Recorded information British Columbia successfully');
   });
   // Fecha browser
   await browser.close();
});

module.exports = infoBritishColumbia;

