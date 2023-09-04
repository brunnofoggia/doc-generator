import { OutputGenerator } from './output.abstract';
import { OutputType } from 'types/output';
import { cloneDeep, defaultsDeep } from 'lodash';
import { PDFOptions } from 'puppeteer';

const defaultConfig: Partial<PDFOptions> = {
    margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
    printBackground: true,
    format: 'A4',
};

export class PdfGenerator extends OutputGenerator {
    protected readonly baseType = OutputType.PDF;
    protected readonly needStream = false;

    public async generate(_params: { stream; path; content; config: PDFOptions }) {
        await super.generate({ stream: _params.stream });

        // TODO: split html into header, html, footer ?
        const params = cloneDeep(_params);
        params.config = defaultsDeep({}, _params.config, defaultConfig);
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
}
