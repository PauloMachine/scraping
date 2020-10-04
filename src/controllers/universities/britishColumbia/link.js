const puppeteer = require('puppeteer');
const fs = require('fs');

// URL para obter os links  
const { urlLinkUniversities } = require('../../../config/url');

// Busca pela universidade específica
const LinkBritishColumbia = (async function LinkBritishColumbia() {
   // Abre a página
   const browser = await puppeteer.launch();
   // Nova página
   const page = await browser.newPage();
   // Vai até a página
   await page.goto(urlLinkUniversities);
   // Selecionando o input com value 100
   await page.select('[name="example_length"]', '100');
   // Filtra por provincia
   await page.$eval('input[type="search"]', el => el.value = 'British Columbia');
   await (await page.$('input[type="search"]')).press('Enter'); 
   // Array com os filtros aplicados
   let infoArray = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('#example_wrapper table tbody tr')
      const infoArray = [...nodeList]
      // Cria estrutura do json
      const infoList = infoArray.map((tr) => ({
         campuses: tr.children[0].innerText,
         link: tr.children[5].innerText,
      }))
      // Retorna json 
      return infoList;
   });
   // Reescrevendo arquivo
   fs.writeFile('./src/json/LinkBritishColumbia.json', JSON.stringify(infoArray, null, 2), err => {
      if (err) throw new Error('There was an error in links British Columbia', err);
      console.log('Recorded links British Columbia successfully');
   });
   // Fecha browser
   await browser.close();
});

module.exports = LinkBritishColumbia;

