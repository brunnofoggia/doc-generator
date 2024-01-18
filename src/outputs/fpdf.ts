import { OutputType } from '../types/output';
import { getClassFromImport } from '../common/utils';
import { createWriteStream } from 'fs';
import KPdfGenerator from './kpdf';

// const defaultConfig: Partial<any> = {};

export class FPdfGenerator extends KPdfGenerator {
    protected baseType = OutputType.FPDF;

    async getLibInstance(params) {
        const FPDF = getClassFromImport(await import('node-fpdf'));
        const instanceParams = this.buildInstanceParams(params.config);

        const instance = new FPDF(...instanceParams);

        return { instance, stream: null };
    }

    savePdf(pdf, params) {
        return new Promise((resolve) => {
            const stream = this._savePdf(pdf, params);
            stream.on('finish', function () {
                resolve({});
            });
        });
    }

    _savePdf(pdf, params: any = {}): any {
        pdf.OutputFix = OutputFix;
        return pdf.OutputFix('f', params.path);
    }
}

function OutputFix(dest = 'F', name = 'doc.pdf', isUTF8 = false) {
    this.Close();

    if (dest.toLowerCase() === 'f') {
        // make sure stream.on.finish will happen
        this.buffer.push(null);
        // return stream to make possible to listen events from it
        return this.buffer.pipe(createWriteStream(name));
    }

    return this.Output(dest, name, isUTF8);
}

export default FPdfGenerator;
