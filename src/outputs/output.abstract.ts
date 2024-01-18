import { unlink } from 'fs';

import { getClassFromImport } from '../common/utils';
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

    async dynamicImport(libName, config) {
        const { libNamedImport = 'default' } = config;
        const import_ = await import(libName);
        const result = getClassFromImport(import_, libNamedImport);

        return result;
    }

    removeFile(path) {
        return new Promise((resolve, reject) => {
            unlink(path, (err) => {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    }
}
