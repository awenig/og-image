// http://localhost:3000/Assurer%20un%20repas%20%C3%A0%201%20euros%20pour%20tous%20les%20%C3%A9tudiants?prenom=Fatiha&nom=Keloua%20Hachi&group=SOC&couleur=e30040&template=explication&id=PA795156&img=1

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
      padding-right: 175px;
      padding-left: 175px;
    }

    .logo-wrapper{
        position: absolute;
        top: 0;
        right: 0;
    }

    .logo{
        width: 450px;
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
      color: white;
      font-family: 'Open Sans';
    }

    .vote {
      font-weight: 800;
      font-size: 80px;
      margin-bottom: 0;
    }

    .explication{
      margin-top: 3rem;
      margin-bottom: 0;
      font-size: 45px;
      font-weight: 400;
    }

    .mp{
      font-weight: 800;
    }

    .group {
      font-size: 75%;
      padding: 0.3em 0.6em;
      border-radius: 0.25rem;
      border: none;
      font-weight: 800;
    }

    .block-lines{
      margin-top: 3rem;
      display: flex;
      flex-direction: row;
    }

    .block-image{
      width: 200px;
      margin-right: 25px;
      padding-right: 25px;
    }

    .image-wrapper{
      width: 200px;
      height: 200px;
      overflow: hidden;
      border-radius: 50%;
      padding: 0;
    }

    .lines{
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .line{
      height: 35px;
      background-color: #efefef;
      margin: .75rem 0 .75rem 0;
    }

    `;
}

function getImg(x: any, imgId: any) {
  if (x == 1) {
    return `
    <div class="block-image">
      <div class="image-wrapper">
        <img style="width: 100%; height: auto; margin-top: -5px" src="https://datan.fr/assets/imgs/deputes_original/depute_${imgId}.png" alt="img" id="photo">
      </div>
    </div>
    `;
  } else {
    return ``;
  }
}

export function getHtmlExplication(parsedReq: ParsedRequest) {
    const { text, theme, md, prenom, nom, group, couleur, id, img } = parsedReq;
    const imgId = id[0].slice(2);
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
        <div class="titre">
          <h1 class="vote">${emojify(md ? marked(text) : sanitizeHtml(text))}</h1>
          <h2 class="explication">L'explication de vote de <span class="mp">${prenom} ${nom}</span> <span class="group" style="background-color: #${couleur}">${group}</span></h2>
          <div class="block-lines">
            ${getImg(img, imgId)}
            <div class="lines">
              <div class="line" style="width: 100%">1</div>
              <div class="line" style="width: 100%">2</div>
              <div class="line" style="width: 100%">2</div>
              <div class="line" style="width: 75%">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}
