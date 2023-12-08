import { template } from 'lodash';
import { Adapters } from 'cloud-solutions';

import { DocGeneratorErrorType } from '../types/error';
import { StreamType } from '../types/stream';
import { error } from '../utils';
import { DomainOptionsUtil } from '../utils/DomainOptions';

export class FileDomain extends DomainOptionsUtil {
    protected domain: any = {};

    async getStream(streamType: StreamType) {
        let stream = this.getProperty(streamType, 'stream');

        if (!stream) stream = this.setProperty(streamType, 'stream', await this.createStream(streamType));
        else {
            // filepath is needed to read after write for copy purposes
            if (!this.getProperty(streamType, 'baseDir')) error(DocGeneratorErrorType.NO_FILE_BASEDIR);
            if (!this.getProperty(streamType, 'filePath')) error(DocGeneratorErrorType.NO_STREAM_FILEPATH);
        }

        return stream;
    }

    async getGenerateStream() {
        return this.getStream(StreamType.GENERATE);
    }

    async createStream(streamType: StreamType) {
        const fs = await this.setFileSystem(streamType);

        if (!fs) error(DocGeneratorErrorType.NO_FILESYSTEM);

        const filePath = this.setFilepath(streamType);
        const stream = await fs.sendStream(filePath);
        return stream;
    }

    async setFileSystem(streamType: StreamType) {
        if (!this.getProperty(streamType, 'fileSystem')) {
            const fs = new Adapters.Local.StorageAdapter();
            await fs.initialize({});

            this.setProperty(streamType, 'fileSystem', fs);
            this.setBaseDir(streamType);
        }

        return this.getProperty(streamType, 'fileSystem');
    }

    setBaseDir(streamType: StreamType) {
        if (!this.getProperty(streamType, 'baseDir')) {
            const fs = this.getProperty(streamType, 'fileSystem');
            if (!fs) error(DocGeneratorErrorType.NO_FILE_BASEDIR);

            this.setProperty(streamType, 'baseDir', fs.getOptions().baseDir);
        }
        return this.getProperty(streamType, 'baseDir');
    }

    async getContent(streamType: StreamType) {
        const fs = this.getProperty(streamType, 'fileSystem');
        const filePath = this.getProperty(streamType, 'filePath');

        return await fs.readContent(filePath);
    }

    getGenerateContent() {
        return this.getContent(StreamType.GENERATE);
    }

    setFilepath(streamType: StreamType) {
        if (!this.getProperty(streamType, 'filePath')) {
            const dirPath = this.getProperty(streamType, 'dirPath');
            if (!dirPath) error(DocGeneratorErrorType.NO_FILE_DIRPATH);
            const fileName = template(this.getProperty(streamType, 'name'))({ streamType });

            const filePath = [dirPath, fileName].join('/');
            this.setProperty(streamType, 'filePath', filePath);
        }

        return this.getProperty(streamType, 'filePath');
    }

    getFullFilepath(streamType: StreamType) {
        const baseDir = this.setBaseDir(streamType);
        const filePath = this.setFilepath(streamType);
        const path = [];

        if (baseDir) path.push(baseDir);
        path.push(filePath);

        return path.join('/');
    }

    readPathFromFullfilePath(streamType: StreamType, path) {
        const baseDir = this.getProperty(streamType, 'baseDir') || '';
        return path.substr(baseDir.length ? baseDir.length + 1 : 0);
    }

    getProperty(streamType: StreamType, property) {
        const options = this.options.file[streamType] || {};
        return options[property] || this.options.file[property];
    }

    setProperty(streamType: StreamType, property, value) {
        !this.options.file[streamType] && (this.options.file[streamType] = {});
        return (this.options.file[streamType][property] = value);
    }

    setGlobalProperty(property, value) {
        return (this.options.file[property] = value);
    }

    getGlobalProperty(property) {
        return this.options.file[property];
    }
}
