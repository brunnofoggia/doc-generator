import { DomainOptionsUtil } from 'utils/DomainOptions';
import { OutputType } from 'types/output';
import { PdfGenerator } from 'outputs/pdf';
import { PlainGenerator } from 'outputs/plain';
import { OutputGenerator } from 'outputs/output.abstract';

interface OutputConfig {
    outputType: OutputType;
    outputConfig: any;
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

    async generate({ stream, content, path }) {
        return await this.instance.generate({ stream, content, config: this.config, path });
    }

    isStreamNeed() {
        return this.instance.isStreamNeed();
    }
}
