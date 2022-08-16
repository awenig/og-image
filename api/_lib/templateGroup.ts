
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const light = readFileSync(`${__dirname}/../_fonts/open-sans-v20-latin-300.woff2`).toString('base64');
const rglr = readFileSync(`${__dirname}/../_fonts/open-sans-v20-latin-regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/open-sans-v20-latin-600.woff2`).toString('base64');
const extrabold = readFileSync(`${__dirname}/../_fonts/open-sans-v20-latin-800.woff2`).toString('base64');

function getCss(theme: string) {
    let background = 'linear-gradient(90deg, #246B96 17.99%, #00B794 86.12%)';

    if (theme === 'dark') {
        background = 'black';
    }
    return `

    @font-face {
        font-family: 'Open Sans';
        font-style:  light;
        font-weight: 300;
        src: local('OpenSans-Regular'), url(data:font/woff2;charset=utf-8;base64,${light}) format('woff2');
    }

    @font-face {
        font-family: 'Open Sans';
        font-style:  normal;
        font-weight: 400;
        src: local('OpenSans-Regular'), url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Open Sans';
        font-style:  bold;
        font-weight: 600;
        src: local('OpenSans-SemiBold'), url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Open Sans';
        font-style:  extrabold;
        font-weight: 800;
        src: local('OpenSans-ExtraBold'), url(data:font/woff2;charset=utf-8;base64,${extrabold}) format('woff2');
    }

    body{
      background: ${background};
      padding: 0;
      font-family: 'Open sans';
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      height: 1080px;
    }

    .container{
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: start;
      width: 100%;
      height: 100%;
      padding-left: 150px;
    }

    .logo-wrapper{
        position: absolute;
        top: 0;
        right: 0;
    }

    .logo{
        width: 550px;
        height: auto;
        margin-left: -70px;
    }

    .inside{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items:center;
    }

    #photo{
      width: 500px;
      height: auto;
      border-radius: 25px;
    }

    .titre{
      margin-left: 75px;
      color: white;
      font-family: 'Open Sans';
    }

    .prenom {
      display: block;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      margin: 0;
      text-align: left;
    }

    .nom{
      font-weight: 800;
      line-height: 1;
      padding: 0;
      margin: 0;
      text-align: left;
    }

    .dpt {
      font-size: 60px;
      margin-top: 30px;
      margin-bottom: 0;
    }

    .groupe {
      font-size: 45px;
      margin-top: 15px;
    }

    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
    }

    `;
}

function getImg(x: any, imgId: any) {
  if (x == 1) {
    return `
    <div class="image">
      <img src="https://datan.fr/assets/imgs/deputes_original/depute_${imgId}.png" alt="img" id="photo">
    </div>
    `;
  } else {
    return ``;
  }
}

export function getHtmlGroup(parsedReq: ParsedRequest) {
    const { text, theme, md, prenom, nom, group, couleur, id, img } = parsedReq;
    const imgId = id[0].slice(2);
    const prenomFont = 6 / (prenom[0].length ** 0.3);
    const nomFont = 8 / (nom[0].length ** 0.3);
    return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
      ${getCss(theme)}
  </style>
  <body>
    <div class="logo-wrapper">
      <img
        class="logo"
        alt="Generated Image"
        src="https://datan.fr/assets/imgs/datan/logo_white_transp.png"
      />
    </div>
    <div class="container">
      <div class="inside">
        ${getImg(img, imgId)}
        <div class="titre">
          <h1>
            GROUP A FAIRE ! 
            <span class="prenom" style="font-size: ${prenomFont}em">${prenom}</span>
            <span class="nom" style="font-size: ${nomFont}em">${nom}</span>
          </h1>
          <h2 class="dpt">${emojify(md ? marked(text) : sanitizeHtml(text))}</h2>
          <h3 class="groupe">${group}</h3>
        </div>
      </div>
    </div>
    <div class="footer" style="background-color: #${couleur}"></div>
  </body>
</html>`;
}
