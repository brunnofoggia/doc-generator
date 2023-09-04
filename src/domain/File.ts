import { each, uniqueId } from 'lodash';
import { Adapters } from 'cloud-solutions';
import { DocGeneratorErrorType } from 'types/error';
import { StreamType } from 'types/stream';
import { error } from 'utils';
import { DomainOptionsUtil } from 'utils/DomainOptions';
import { v4 as uuidv4 } from 'uuid';

export class FileDomain extends DomainOptionsUtil {
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
        let fs = this.getProperty(streamType, 'fileSystem');
        if (!fs) fs = this.setProperty(streamType, 'fileSystem', await this.createFileSystem(streamType));

        if (!fs) error(DocGeneratorErrorType.NO_FILESYSTEM);

        const filePath = this.setProperty(streamType, 'filePath', this.setFilepath(streamType));
        const stream = await fs.sendStream(filePath);
        return stream;
    }

    async createFileSystem(streamType: StreamType) {
        const dirPath = this.getProperty(streamType, 'dirPath');
        if (!dirPath) error(DocGeneratorErrorType.NO_FILE_DIRPATH);

        const fs = new Adapters.Local.StorageAdapter();
        await fs.initialize({
            Bucket: dirPath,
        });
        this.setProperty(streamType, 'baseDir', fs.getOptions().baseDir);

        return fs;
    }

    async getContent(streamType: StreamType) {
        const fs = await this.createFileSystem(streamType);
        const filePath = this.getProperty(streamType, 'filePath');

        return await fs.readContent(filePath);
    }

    getGenerateContent() {
        return this.getContent(StreamType.GENERATE);
    }

    setFilepath(streamType: StreamType) {
        const uid = this.getUid();
        const path = [uid, uniqueId(`${streamType}`)].join('/');
        return path;
    }

    getFullFilepath(streamType: StreamType) {
        const baseDir = this.getProperty(streamType, 'baseDir');
        const filePath = this.getProperty(streamType, 'filePath');
        const path = [];

        if (baseDir) path.push(baseDir);
        path.push(filePath);

        return path.join('/');
    }

    readPathFromFullfilePath(streamType: StreamType, path) {
        const baseDir = this.getProperty(streamType, 'baseDir') || '';
        return path.substr(baseDir.length ? baseDir.length + 1 : 0);
    }

    getUid() {
        let uid = this.getGlobalProperty('uid');
        if (!uid) uid = this.setUid();

        return uid;
    }

    setUid() {
        const uid = uuidv4();
        this.setGlobalProperty('uid', uid);

        return uid;
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
