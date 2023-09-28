import { ObjectLiteral } from 'typeorm';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

import { TemplateGenerator } from '../templates/template.abstract';
import { TemplateConfigInterface } from './entities';

export interface FileOptions {
    fileSystem?: FileSystem;
    stream?: WriteStreamInterface;

    baseDir?: string;
    dirPath?: string;
    filePath?: string;
}

export interface Files extends FileOptions {
    generate?: FileOptions;
    output?: FileOptions;
}

export interface DatabaseOptions {
    relationsKeys: TemplateConfigRelations;
    contentId: string;
    contentParentId: string;
    contentName: string;
}

export interface DomainOptions {
    templateConfig: TemplateConfigInterface;
    database: DatabaseOptions;
    file: Files;
}

export interface TemplateConfigRelations {
    template: string;
    contents: string;
}

export interface TemplateObjectListInterface {
    [x: string]: TemplateGenerator;
}

export interface Service {
    getIdAttribute(): string;
    find(options?: any): Promise<ObjectLiteral[]>;
}

export interface FileSystem {
    readContent(path, options?);
    sendContent(path, content, options?);
    readStream(path, options?);
    sendStream?(path, options?);
}
