
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
      height: 100vh;
      margin: 40px 150px;
      font-family: 'Open sans';
    }

    .sort{
      position: absolute;
      right: 0;
      top: 0;
      box-shadow: inset 3px 1px 4px rgb(0 0 0 / 25%);
      padding: 35px 120px;
      background-color: #fff;
      border-bottom-left-radius: 40px;
    }

    .sort span{
      font-size: 60px;
      font-weight: 800;
    }

    .sort.adopté{
      color: #00B794;
    }

    .sort.rejeté{
      color: #C5283D;
    }

    .logo-wrapper{
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: left;
    }

    .logo{
        width: 500px;
        height: auto;
        margin-left: -70px;
    }

    .inside{
      margin-right: 100px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items:center;
    }

    #photo{
      width: 300px;
      height: auto;
      border-radius: 25px;
    }

    .titre{
      margin-left: 50px;
      color: white;
      font-family: 'Open Sans';
    }

    .prenom {
      display: block;
      line-height: 1;
      font-weight: 400;
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
      font-size: 35px;
      margin: 0;
    }

    .groupe {
      font-size: 25px;
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

export function getHtmlMP(parsedReq: ParsedRequest) {
    const { text, theme, md, prenom, nom, group, couleur, id, img } = parsedReq;
    console.log(id);
    const imgId = id[0].slice(2);
    console.log(img);
    return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
      ${getCss(theme)}
  </style>
  <body>
    <div class="sort adopté">
      <span>xx</span>
    </div>
    <div class="logo-wrapper">
      <img
        class="logo"
        alt="Generated Image"
        src="https://datan.fr/assets/imgs/datan/logo_white_transp.png"
      />
    </div>

    <div class="inside">
      ${getImg(img, imgId)}
      <div class="titre">
        <h1>
          <span class="prenom">${prenom}</span>
          <span class="nom">${nom}</span>
        </h1>
        <h2 class="dpt">${emojify(md ? marked(text) : sanitizeHtml(text))}</h2>
        <h3 class="groupe">${group}</h3>
      </div>
    </div>
    <div class="footer" style="background-color: #${couleur}"></div>
  </body>
</html>`;
}
