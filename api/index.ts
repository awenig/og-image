import { IncomingMessage, ServerResponse } from 'http';
import { parseRequest } from './_lib/parser';
import { getScreenshot } from './_lib/chromium';
import { getHtmlVote } from './_lib/templateVote';
import { getHtmlMP } from './_lib/templateMP';
import { getHtmlGroup } from './_lib/templateGroup';

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    try {
        const parsedReq = parseRequest(req);
        let html = '';

        if (parsedReq.template[0] == 'vote') {
          html = getHtmlVote(parsedReq);
        } else if(parsedReq.template[0] == 'mp') {
          html = getHtmlMP(parsedReq);
        } else if (parsedReq.template[0] == 'group') {
          html = getHtmlGroup(parsedReq);
        }

        if (isHtmlDebug) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
        }
        const { fileType } = parsedReq;
        const file = await getScreenshot(html, fileType, isDev);
        res.statusCode = 200;
        res.setHeader('Content-Type', `image/${fileType}`);
        res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
        res.end(file);
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
        console.error(e);
    }
}
