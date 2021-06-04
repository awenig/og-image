
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

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        border: 2px solid pink;
        margin: 50px 150px;
        font-family: 'Open sans';
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: left;
    }

    .logo {
        width: 300px;
        height: auto;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .container{
      border: 5px solid black;
      display: flex;
    }

    .left{
      border: 3px solid pink;
      width: 70%;
    }

    .right{
      border: 3px solid yellow;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .subheading {
        font-family: 'Open sans';
        font-size: 25px;
        font-weight: 300;
        color: ${foreground};
        line-height: 1.8;
        font-weight: 200;
        margin-top: 50px;
    }

    .heading {
        font-family: 'Open Sans';
        font-size: 80px;
        font-weight: 800;
        color: ${foreground};
        line-height: 1.8;
        margin-top: 30px;
    }

    .card{
      border-radius: 10px;
      box-shadow: 3px 3px 10px rgb(0 0 0 / 8%);
      background-color: #fff;
      position: relative;
      display: flex;
      flex-direction: column;
      height: 600px;
      width: 400px;
    }

    .card-header{
      background-color: #00B794;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      color: white;
      padding: 0 10px;
      text-align: center;
      font-size: 20px;
    }

    .card-body{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .infos{
      margin-bottom: 0;
      margin-top: 50px;
    }

    li{
      list-style: none;
      margin-bottom: 20px;
      display: flex;
      font-size: 20px;
    }

    .label{
      min-width: 30px;
      margin-right: 20px;
    }

    .value{
      font-weight: 600
    }

    svg{
      color: #00B794;
      width: 25px;
      height: auto;
    }

    .results{
      text-align: center;
      color: #fff;
      display: flex;

    }

    .flex-fill{
      flex: 1 1 auto!important;
      padding: 5px 0;
    }

    .legend{
      font-weight: 600;
      display: block;
    }

    .number{
      font-weight: 800;
      font-size: 20px;
      display: block;
    }



    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, voteN, legislature, date, type, pour, abs, contre } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper" style="border: 1px solid red">
              <img
                  class="logo"
                  style = "border: 1px solid yellow"
                  alt="Generated Image"
                  src="https://datan.fr/assets/imgs/datan/logo_white_transp.png"
              />
            </div>
            <div class="container">
              <div class="left">
                <div class="subheading" style="border: 1px solid red">Vote n° ${voteN} - Législature ${legislature} - ${date}</div>
                <div class="heading" style="border: 1px solid red">
                  ${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                  )}
                </div>
              </div>
              <div class="right">
                <div class="card">
                  <div class="card-header">
                    <h2>VOTE n° ${voteN}</h2>
                  </div>
                  <div class="card-body">
                    <ul class="infos">
                      <li>
                        <div class="label">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-calendar2-week" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"></path><path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"></path></svg>
                        </div>
                        <div class="value">${date}</div>
                      </li>
                      <li>
                        <div class="label">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-journal-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"></path><path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"></path><path fill-rule="evenodd" d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708z"></path></svg>
                        </div>
                        <div class="value">${type}</div>
                      </li>
                    </ul>
                    <div class="pieContainer"></div>
                    <div class="results">
                      <div class="flex-fill" style="background-color: #00B794; border-bottom-left-radius: 10px;">
                        <span class="legend">POUR</span>
                        <span class="number">${pour}</span>
                      </div>
                      <div class="flex-fill" style="background-color: #FFAD29">
                        <span class="legend">ABSTENTION</span>
                        <span class="number">${abs}</span>
                      </div>
                      <div class="flex-fill" style="background-color: #C5283D; border-bottom-right-radius: 10px;">
                        <span class="legend">CONTRE</span>
                        <span class="number">${contre}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </body>
</html>`;
}
