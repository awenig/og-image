
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
    let foreground = 'white';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
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

    .container{
      margin-right: 100px;
    }

    .subheading {
        font-family: 'Open sans';
        font-size: 40px;
        font-weight: 300;
        color: ${foreground};
        line-height: 1.8;
        font-weight: 200;
        margin-top: 20px;
    }

    .heading {
        font-family: 'Open Sans';
        font-size: 100px;
        line-height: 1.25;
        font-weight: 800;
        color: ${foreground};
        margin-top: 20px;
    }

    .footer{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 110px;
      display: flex;
    }

    .footer div{
      color: #fff;
      font-weight: 800;
      font-size: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    `;
}

export function getHtmlMP(parsedReq: ParsedRequest) {
    const { text, theme, md, prenom, nom, group, couleur } = parsedReq;
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
    <div class="container">
      <div class="subheading">ICI NEW SUBHEADING FOR MP</div>
      <h1>${prenom} ${nom}</h1>
      <h1 class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</h1>
      <h2>${group}</h2>
    </div>
    <div class="footer" style="background-color: #${couleur}"></div>
  </body>
</html>`;
}
