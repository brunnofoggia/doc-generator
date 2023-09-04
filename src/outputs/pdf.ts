import { OutputGenerator } from './output.abstract';
import { OutputType } from 'types/output';
import { cloneDeep, defaultsDeep } from 'lodash';
import { PDFOptions } from 'puppeteer';

// https://pptr.dev/api/puppeteer.pdfoptions
const defaultConfig: Partial<PDFOptions> = {
    margin: {
        top: '200px',
        right: '0px',
        bottom: '200px',
        left: '0px',
    },
    printBackground: true,
    format: 'A4',
    displayHeaderFooter: false,
};

export class PdfGenerator extends OutputGenerator {
    protected readonly baseType = OutputType.PDF;
    protected readonly needStream = false;

    public async generate(_params: { stream; path; content; config: PDFOptions }) {
        await super.generate({ stream: _params.stream });

        const params = cloneDeep(_params);
        params.config = defaultsDeep({}, _params.config, defaultConfig);

        const { header, body, footer } = this.splitHeaderAndFooterFromHTML(_params.content);
        this.setHeaderAndFooter(params, header, footer);
        params.content = body;

        params.path = this.buildPath(params.path);
        return this.conversion(params);
    }

    buildPath(_path) {
        return _path + '.pdf';
    }

    protected async conversion(params) {
        const puppeteer = (await import('puppeteer')).default;

        // Create a browser instance
        const browser = await puppeteer.launch({ headless: 'new' });

        // Create a new page
        const page = await browser.newPage();

        //Get HTML content from HTML file
        console.log('content written into pdf', params.content);
        await page.setContent(params.content, { waitUntil: 'domcontentloaded' });

        // To reflect CSS used for screens instead of print
        await page.emulateMediaType('screen');

        const path = params.path;
        console.log('pdf path', path);

        // Download the PDF
        await page.pdf({
            path,
            ...params.config,
        });

        // Close the browser instance
        await browser.close();

        return { path };
    }

    splitHeaderAndFooterFromHTML(html) {
        const headerRegex = /<header>((.|\n|\t|\r)+)<\/header>/g;
        const header = (html.match(headerRegex)[0] || '').replace(/<\/?header>/g, '').trim();
        const footerRegex = /<footer>((.|\n|\t|\r)+)<\/footer>/g;
        const footer = (html.match(footerRegex)[0] || '').replace(/<\/?footer>/g, '').trim();
        const body = html.replace(headerRegex, '').replace(footerRegex, '');

        return { body, header, footer };
    }

    setHeaderAndFooter(params, header, footer) {
        this.setHeader(params, header);
        this.setFooter(params, footer);
    }

    setHeader(params, header) {
        if (header.length) {
            params.config.displayHeaderFooter = true;
            params.config.headerTemplate = header;
        }
    }

    setFooter(params, footer) {
        if (footer.length) {
            params.config.displayHeaderFooter = true;
            params.config.footerTemplate = footer;
        }
    }
}
