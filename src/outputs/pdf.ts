import { cloneDeep, defaultsDeep } from 'lodash';
import { PDFOptions } from 'puppeteer';

import { OutputGenerator } from './output.abstract';
import { OutputType } from '../types/output';
import { OutputGenerateParams } from '../interfaces/domain';

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

    public async generate(_params: OutputGenerateParams) {
        await super.generate({ stream: _params.stream });

        const params = cloneDeep(_params);
        params.config = defaultsDeep({}, _params.config, defaultConfig);

        const { header, body, footer } = this.splitHeaderAndFooterFromHTML(_params.content);
        this.setHeaderAndFooter(params, header, footer);
        params.content = body;

        await this.createDirTree(params.path, _params.fileSystem);
        params.path = this.preparePath(params.path, _params.fileSystem);
        return this.conversion(params);
    }

    preparePath(path, fs) {
        if (!path.startsWith(fs.getOptions().baseDir)) {
            path = [fs.getOptions().baseDir, path.replace(/^\//, '')].join('/');
        }

        return path;
    }

    async createDirTree(_path, fs) {
        const path = _path.replace(fs.getOptions().baseDir + '/', '');
        await fs.sendContent(path, '');
        await fs.deleteFile(path);
    }

    protected async conversion(params) {
        const puppeteer = (await import('puppeteer')).default;

        // Create a browser instance
        const browser = await puppeteer.launch({ headless: 'new' });

        // Create a new page
        const page = await browser.newPage();

        //Get HTML content from HTML file
        await page.setContent(params.content, { waitUntil: 'domcontentloaded' });

        // To reflect CSS used for screens instead of print
        await page.emulateMediaType('screen');

        const path = params.path;

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
        const headerMatch = html.match(headerRegex) || [];
        const header = (headerMatch[0] || '').replace(/<\/?header>/g, '').trim();
        const footerRegex = /<footer>((.|\n|\t|\r)+)<\/footer>/g;
        const footerMatch = html.match(footerRegex) || [];
        const footer = (footerMatch[0] || '').replace(/<\/?footer>/g, '').trim();
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

export default PdfGenerator;
