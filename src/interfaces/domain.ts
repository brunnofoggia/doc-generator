import { TemplateGenerator } from 'templates/template.abstract';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

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
    find: any;
    configRelations: TemplateConfigRelations;
    contentId: string;
    contentParentId: string;
    contentName: string;
}

export interface DomainOptions {
    // templateService: Service;
    // templateConfigService: Service;
    // templateContentService: Service;
    // templateWhere: FindOptionsWhere<ObjectLiteral>;

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
