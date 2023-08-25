import { CrudService } from 'node-common/dist/services/crud.service';
import { TemplateGenerator } from 'templates/template.abstract';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

export interface DomainOptions {
    // TODO: substituir tipo CrudService  por objeto que contenha os metodos necessarios
    templateService: CrudService<ObjectLiteral>;
    templateConfigService: CrudService<ObjectLiteral>;
    templateContentService: CrudService<ObjectLiteral>;
    templateWhere: FindOptionsWhere<ObjectLiteral>;
    stream: WriteStreamInterface;
    database: {
        configRelations: TemplateConfigRelations;
        contentParentId: string;
        contentName: string;
    };
}

export interface TemplateConfigRelations {
    template: string;
    contents: string;
}

export interface TemplateObjectListInterface {
    [x: string]: TemplateGenerator;
}
