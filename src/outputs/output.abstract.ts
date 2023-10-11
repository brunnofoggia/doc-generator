import { OutputGenerateParams } from '../interfaces/domain';
import { OutputType } from '../types/output';

export abstract class OutputGenerator {
    protected abstract baseType: OutputType;
    protected abstract needStream: boolean;

    getBaseType() {
        return this.baseType;
    }

    isStreamNeed() {
        return this.needStream;
    }

    // should be able to write all content to a pdf
    // or return file generated without modifications
    public async generate(_params: Partial<OutputGenerateParams>): Promise<any> {
        if (!this.isStreamNeed()) {
            await _params?.stream?.end();
        }
        return {};
    }
}
