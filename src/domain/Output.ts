import { DomainOptionsUtil } from '../utils/DomainOptions';
import { OutputType } from '../types/output';
import { OutputGenerator } from '../outputs/output.abstract';
import { OutputGenerateParams } from '../interfaces/domain';
import { getClassFromImport } from 'node-common/dist/utils';

interface OutputConfig {
    outputType: OutputType;
    outputConfig: any;
}

export class OutputDomain extends DomainOptionsUtil {
    protected domain: any = {};
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
        const ext = /\.js$/.test(__filename) ? '.js' : '.ts';

        let _import;
        switch (type) {
            case OutputType.PPDF:
                _import = await import(`../outputs/ppdf${ext}`);
                break;
            case OutputType.FPDF:
                _import = await import(`../outputs/fpdf${ext}`);
                break;
            case OutputType.KPDF:
                _import = await import(`../outputs/kpdf${ext}`);
                break;
            default:
                _import = await import(`../outputs/plain${ext}`);
        }
        const _class = getClassFromImport(_import);
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

    useContentAsStream() {
        return this.instance.useContentAsStream();
    }
}
