import { DomainOptionsUtil } from '../utils/DomainOptions';
import { OutputType } from '../types/output';
import { OutputGenerator } from '../outputs/output.abstract';
import { OutputGenerateParams } from '../interfaces/domain';
import { getClassFromImport } from '../common/utils';

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
        this.instance = await OutputDomain.outputFactory(this.config);
    }

    static async outputFactory(config): Promise<OutputGenerator> {
        const _class = await this.defineTemplateClass(config);
        return new _class();
    }

    static async defineTemplateClass(config) {
        const type = this.readType(config);
        const ext = /\.js$/.test(__filename) ? '.js' : '.ts';

        let _import;
        switch (type) {
            // case OutputType.PPDF:
            //     _import = await import(`../outputs/ppdf${ext}`);
            //     break;
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

    static readType(config) {
        return config.outputType ? config.outputType.toUpperCase() : OutputType.PLAIN;
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
