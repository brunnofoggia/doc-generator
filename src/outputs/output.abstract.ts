import { OutputGenerateParams } from '../interfaces/domain';
import { OutputType } from '../types/output';

export abstract class OutputGenerator {
    protected abstract baseType: OutputType;
    protected abstract needStream: boolean;
    protected abstract contentAsStream: boolean;
    abstract generate(params);

    getBaseType() {
        return this.baseType;
    }

    isStreamNeed() {
        return this.needStream;
    }

    useContentAsStream() {
        return this.contentAsStream;
    }

    // should be able to write all content to a pdf
    // or return file generated without modifications
    public async prepare(_params: Partial<OutputGenerateParams>): Promise<any> {
        if (!this.isStreamNeed()) {
            await _params?.stream?.end();
        }
        return {};
    }

    buildPathForFs(path, fs) {
        return path.substr(fs.options.baseDir.length + 1);
    }
}
