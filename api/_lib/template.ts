
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string) {
    let background = 'linear-gradient(90deg, #246B96 17.99%, #00B794 86.12%)';
    let foreground = 'white';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        border: 2px solid pink;
        margin: 50px 150px;
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
        justify-items: left;
    }

    .logo {
        width: 300px;
        height: auto;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .subheading {
        font-family: 'Inter', sans-serif;
        font-size: 25px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        font-weight: 200;
        margin-top: 50px;
    }

    .heading {
        font-family: 'Inter', sans-serif;
        font-size: 80px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        margin-top: 30px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, voteN, legislature } = parsedReq;
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
            <div class="subheading" style="border: 1px solid red">Vote n° ${voteN} - Législature ${legislature} - 20 juillet 2020</div>
            <div class="heading" style="border: 1px solid red">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}
