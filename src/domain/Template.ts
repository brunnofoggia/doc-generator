import { chain, each, keyBy, map, size, sortBy } from 'lodash';
import { ObjectLiteral } from 'typeorm';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

import { DomainOptions, TemplateObjectListInterface } from '../interfaces/domain';
import { TemplateConfigInterface, TemplateContentInterface, TemplateContentObjectListInterface, TemplateInterface } from '../interfaces/entities';
import { TemplateGenerator } from '../templates/template.abstract';
import { DocGeneratorErrorType } from '../types/error';
import { TemplateType } from '../types/template';
import { error } from '../utils';
import { HtmlGenerator } from '../templates/html';
import { TxtGenerator } from '../templates/txt';
import { CsvGenerator } from '../templates/csv';
import { DomainOptionsUtil } from '../utils/DomainOptions';

export class TemplateDomain extends DomainOptionsUtil {
    async findTemplateConfig(): Promise<TemplateConfigInterface> {
        const templateConfig = (await this.options.database.find()).shift();

        if (!size(templateConfig)) error(DocGeneratorErrorType.NO_CONFIG);
        return templateConfig as TemplateConfigInterface;
    }

    normalizeTemplateContents(contents: TemplateContentInterface[]): TemplateContentInterface[] {
        const contentsKey = this.getContentsKey();
        return map(contents, (content) => {
            // ensure contents array
            content[contentsKey] = [];
            // equalize type caps
            content.config.type = content.config.type.toUpperCase() as TemplateType;
            return content;
        });
    }

    templateFactory(templateContent: TemplateContentInterface, globalConfig: ObjectLiteral): TemplateGenerator {
        const id = this.readContentId(templateContent);
        const name = this.readContentName(templateContent);
        const parentId = this.readContentParentId(templateContent);
        const params = { data: templateContent, id, name, parentId: parentId || 0, globalConfig };

        const _class = this.defineTemplateClass(this.readContentType(templateContent));
        return new _class(params);
    }

    defineTemplateClass(type) {
        let _class;
        switch (type) {
            case TemplateType.HTML:
                _class = HtmlGenerator;
                break;
            case TemplateType.CSV:
                _class = CsvGenerator;
                break;
            default:
                _class = TxtGenerator;
        }

        return _class;
    }

    templatesFactory(contents: TemplateContentInterface[], globalConfig: ObjectLiteral): TemplateGenerator[] {
        return map(contents, (content) => this.templateFactory(content, globalConfig));
    }

    buildTemplatesTree(templates: TemplateGenerator[]) {
        const templatesIndexed = this.keyByIdTemplates(templates);
        return (
            chain(templatesIndexed)
                .map((template) => {
                    // insert children inside parent
                    const parentId = template.getParentId();
                    if (parentId) templatesIndexed[parentId].addChildren(template);
                    return template;
                })
                .map((template) => {
                    return template.sortChildren();
                })
                .map((template) => {
                    // clear children from root
                    return !template.getParentId() ? template : null;
                })
                // remove children remains at root
                .filter((template) => !!template)
                // sort root templates
                .sortBy((template) => template.getOrder())
                .value()
        );
    }

    keyByIdTemplates(templates: TemplateGenerator[]): TemplateObjectListInterface {
        return keyBy(templates, (template: TemplateGenerator) => template.getId());
    }

    keyByIdTemplateContents(contents: TemplateContentInterface[]): TemplateContentObjectListInterface {
        return keyBy(contents, this.getContentIdKey());
    }

    async validateAll(templates: TemplateGenerator[]): Promise<boolean> {
        for (const template of templates) {
            await template.validateRecursively();
        }

        return true;
    }

    async generateAll(templates: TemplateGenerator[], data, stream: WriteStreamInterface) {
        const outputs: any = {};
        for (const template of templates) {
            await template.generateRecursively(data, stream, outputs);
        }

        await stream.end();
    }

    buildTemplateConfigRelations() {
        const relations: any = {};
        each(this.options.database.configRelations, (name) => (relations[name] = true));
        return relations;
    }

    getContentsKey() {
        return this.options.database.configRelations.contents;
    }

    getTemplateRootKey() {
        return this.options.database.configRelations.template;
    }

    getContentIdKey() {
        return this.options.database.contentId;
    }

    getContentNameKey() {
        return this.options.database.contentName;
    }

    getContentParentIdKey() {
        return this.options.database.contentParentId;
    }

    getContents(templateConfig): TemplateContentInterface[] {
        const contentsKey = this.getContentsKey();
        return templateConfig[contentsKey];
    }

    getTemplateRoot(templateConfig): TemplateInterface {
        const templateRootKey = this.getTemplateRootKey();
        return templateConfig[templateRootKey];
    }

    readContentId(content: TemplateContentInterface) {
        return content[this.getContentIdKey()];
    }

    readContentName(content: TemplateContentInterface) {
        return content[this.getContentNameKey()];
    }

    readContentParentId(content: TemplateContentInterface) {
        return content[this.getContentParentIdKey()];
    }

    readContentType(content: TemplateContentInterface) {
        return content.config.type.toUpperCase();
    }
}
