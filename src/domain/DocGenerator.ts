import { defaultsDeep, each } from 'lodash';
import { DocGeneratorErrorType } from '../types/error';
import { error } from '../utils';
import { DomainOptions } from 'interfaces/domain';
import { TemplateDomain } from './Template';
import { TemplateGenerator } from 'templates/template.abstract';
import { ObjectLiteral } from 'typeorm';
import { WriteStream } from 'cloud-solutions/dist/common/abstract/writeStream';

export class DocGeneratorDomain {
    protected options: Partial<DomainOptions> = {};
    protected templateDomain: TemplateDomain;
    protected templates: TemplateGenerator[];

    globalConfig: ObjectLiteral;

    constructor(options: Partial<DomainOptions>) {
        this.templateDomain = new TemplateDomain({});
        this.setOptions(options);
    }

    setOptions(options: Partial<DomainOptions>) {
        each(options, (value, index) => (this.options[index] = value));
        this.templateDomain.setOptions(options);
    }

    async buildTemplatesList() {
        const templateConfig = await this.findTemplateConfig();
        this.buildGlobalConfig(templateConfig);

        this.templates = this.templateDomain.buildChainOfTemplates(
            this.templateDomain.templatesFactory(
                this.templateDomain.normalizeTemplateContents(this.templateDomain.getContents(templateConfig)),
                this.globalConfig,
            ),
        );
        return this;
    }

    findTemplateConfig() {
        return this.templateDomain.findTemplateConfig();
    }

    buildGlobalConfig(templateConfig) {
        const template = this.templateDomain.getTemplateRoot(templateConfig);
        return (this.globalConfig = defaultsDeep(templateConfig.config, template.defaultConfig));
    }

    async validateTemplates() {
        this.templateDomain.validateAll(this.templates);
        return this;
    }

    async generate(data, stream = null) {
        if (stream) this.options.stream = stream;
        if (!this.options.stream) error(DocGeneratorErrorType.NO_STREAM);
        if (!(this.options.stream instanceof WriteStream)) error(DocGeneratorErrorType.INCOMPATIBLE_STREAM);

        await this.templateDomain.generateAll(this.templates, data, this.options.stream);

        return this;
    }
}
