import debug_ from 'debug';
const debug = debug_('app:docs:KPdfGenerator');

import { isArray } from 'lodash';
import { createWriteStream } from 'fs';

import { getClassFromImport } from 'node-common/dist/utils';

import { OutputGenerator } from './output.abstract';
import { OutputType } from '../types/output';
import { OutputGenerateParams } from '../interfaces/domain';

// const defaultConfig: Partial<any> = {};

export class KPdfGenerator extends OutputGenerator {
    protected baseType = OutputType.KPDF;
    protected readonly needStream = false;
    protected readonly contentAsStream = true;

    async prepare(_params) {
        await super.prepare(_params);

        // create dir tree before conversion
        const path = this.buildPathForFs(_params.path, _params.fileSystem);
        await _params.fileSystem.sendContent(path, '');

        return _params;
    }

    async generate(_params: OutputGenerateParams) {
        const params = await this.prepare(_params);
        return this.conversion(params);
    }

    async conversion(params) {
        const { instance: pdf, stream } = await this.getLibInstance(params);

        await this.buildFromContent(params.content, pdf, params);
        await this.savePdf(pdf, params, stream);

        return { path: params.path };
    }

    buildInstanceParams(config) {
        const instanceParams = !config.libInstanceParams
            ? []
            : isArray(config.libInstanceParams)
            ? config.libInstanceParams
            : [config.libInstanceParams];

        return instanceParams;
    }

    async getLibInstance(params) {
        const KPDF = getClassFromImport(await import('pdfkit'));
        const instanceParams = this.buildInstanceParams(params.config);

        const instance = new KPDF(...instanceParams);

        const stream = instance.pipe(createWriteStream(params.path));

        return { instance, stream };
    }

    async buildFromContent(content, pdf, params) {
        for await (const line of content) {
            await this.buildLine(line, pdf, params);
        }
    }

    async buildLine(line, pdf, params) {
        const { method, args } = this.buildLineOptions(line);
        if (!method) return;
        if (!pdf[method]) {
            throw new Error(['template error at method;', 'line:', line, 'method name', method].join(' '));
        }

        await pdf[method](...(args || []));
    }

    buildLineOptions(line) {
        const splitter = '###';
        const [method, args_] = line.trim().split(splitter);
        if (!method) return {};

        return { method, args: this.buildLineArgs(args_, line) };
    }

    buildLineArgs(args_, line) {
        args_ = (args_ || '').trim();
        let args = args_ || '[]';
        if (!args.startsWith('[')) args = ['[', args].join('');
        if (!args.endsWith(']')) args = [args, ']'].join('');

        let json = [];
        try {
            json = JSON.parse(args);
        } catch (err) {
            debug('template error at arguments;', 'line:', line);
            debug('arguments string', args);
            debug('problem:', err.message);

            throw err;
        }
        return json;
    }

    savePdf(pdf, params, stream = null) {
        return new Promise((resolve) => {
            stream.on('finish', function () {
                resolve({});
            });
            this._savePdf(pdf);
        });
    }

    _savePdf(pdf): any {
        return pdf.end();
    }
}

export default KPdfGenerator;
