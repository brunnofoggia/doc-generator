import { DomainOptionsUtil } from '../utils/DomainOptions';
import { OutputType } from '../types/output';
import { OutputGenerator } from '../outputs/output.abstract';
import { OutputGenerateParams } from '../interfaces/domain';

interface OutputConfig {
    outputType: OutputType;
    outputConfig: any;
}

export class OutputDomain extends DomainOptionsUtil {
    protected config: Partial<OutputConfig> = {};
    protected instance: OutputGenerator;

    async setConfig(config: Partial<OutputConfig>) {
        this.config = config;
        await this.outputFactory();
    }

    async outputFactory(): Promise<OutputGenerator> {
        const _class = await this.defineTemplateClass();
        return (this.instance = new _class());
    }

    async defineTemplateClass() {
        const type = this.readType();
        const ext = /\.js$/.test(__filename) ? 'js' : 'ts';

        let _class;
        switch (type) {
            case OutputType.PDF:
                _class = (await import(`../outputs/pdf.${ext}`)).default;
                break;
            default:
                _class = (await import(`../outputs/plain.${ext}`)).default;
        }

        return _class;
    }

    readType() {
        return this.config.outputType ? this.config.outputType.toUpperCase() : OutputType.PLAIN;
    }

    async generate({ fileSystem: fs, stream, content, path, config }: OutputGenerateParams) {
        return await this.instance.generate({ fileSystem: fs, stream, content, config: config || this.config.outputConfig || {}, path });
    }

    isStreamNeed() {
        return this.instance.isStreamNeed();
    }
}
