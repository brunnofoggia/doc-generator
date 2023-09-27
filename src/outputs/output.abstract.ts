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
    public async generate(params: any): Promise<any> {
        if (!this.isStreamNeed()) {
            await params?.stream?.end();
        }
        return {};
    }
}
