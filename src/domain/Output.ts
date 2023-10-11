import { PDFOptions } from 'puppeteer';
import { DeepPartial } from 'typeorm';

import { DomainOptionsUtil } from '../utils/DomainOptions';
import { OutputType } from '../types/output';
import { PdfGenerator } from '../outputs/pdf';
import { PlainGenerator } from '../outputs/plain';
import { OutputGenerator } from '../outputs/output.abstract';
import { OutputGenerateParams } from '../interfaces/domain';

interface OutputConfig {
    outputType: OutputType;
    outputConfig: any;
    pdfConfig?: DeepPartial<PDFOptions>;
}

export class OutputDomain extends DomainOptionsUtil {
    protected config: Partial<OutputConfig> = {};
    protected instance: OutputGenerator;

    setConfig(config: Partial<OutputConfig>) {
        this.config = config;
        this.outputFactory();
    }

    outputFactory(): OutputGenerator {
        const _class = this.defineTemplateClass();
        return (this.instance = new _class());
    }

    defineTemplateClass() {
        const type = this.readType();

        let _class;
        switch (type) {
            case OutputType.PDF:
                _class = PdfGenerator;
                break;
            default:
                _class = PlainGenerator;
        }

        return _class;
    }

    readType() {
        return this.config.outputType ? this.config.outputType.toUpperCase() : OutputType.PLAIN;
    }

    async generate({ fileSystem: fs, stream, content, path, config }: OutputGenerateParams) {
        return await this.instance.generate({ fileSystem: fs, stream, content, config: config || this.config.pdfConfig || {}, path });
    }

    isStreamNeed() {
        return this.instance.isStreamNeed();
    }
}
