import { defaultsDeep, each, size, uniqueId } from 'lodash';
import { DocGeneratorErrorType } from '../types/error';
import { error } from '../utils';
import { DomainOptions } from 'interfaces/domain';
import { TemplateDomain } from './Template';
import { TemplateGenerator } from 'templates/template.abstract';
import { DeepPartial, ObjectLiteral } from 'typeorm';
import { WriteStream } from 'cloud-solutions/dist/common/abstract/writeStream';
import { Adapters } from 'cloud-solutions';
import { StreamType } from 'types/stream';
import { FileDomain } from './File';
import { DomainOptionsUtil } from 'utils/DomainOptions';
import { TemplateConfigInterface } from 'interfaces/entities';
import { OutputDomain } from './Output';
import { OutputType } from 'types/output';

const getDefaultOptions = (): Partial<DomainOptions> => ({
    database: {
        configRelations: {
            template: 'template',
            contents: 'templateContents',
        },
        contentId: 'id',
        contentParentId: 'templateContentId',
        contentName: 'name',
        find: () => null,
    },
    file: {
        dirPath: 'doc-generator',
    },
});

interface Domains {
    template: TemplateDomain;
    file: FileDomain;
    output: OutputDomain;
}

export class DocGeneratorDomain extends DomainOptionsUtil {
    protected domain: Partial<Domains>;
    protected templateConfig: TemplateConfigInterface;
    protected templates: TemplateGenerator[];

    globalConfig: ObjectLiteral;

    constructor(options: DeepPartial<DomainOptions>) {
        super(options, getDefaultOptions());
    }

    setChild() {
        if (!size(this.domain)) {
            this.domain = {};
            this.domain.template = new TemplateDomain();
            this.domain.file = new FileDomain();
            this.domain.output = new OutputDomain();
        }

        return this.getChild();
    }

    async buildTemplatesList() {
        await this.setTemplateConfig();

        this.templates = this.domain.template.buildTemplatesTree(
            this.domain.template.templatesFactory(
                this.domain.template.normalizeTemplateContents(this.domain.template.getContents(this.templateConfig)),
                this.globalConfig,
            ),
        );
        return this;
    }

    async setTemplateConfig() {
        await this.findTemplateConfig();
        this.buildGlobalConfig();
    }

    async findTemplateConfig() {
        if (!this.templateConfig) {
            this.templateConfig = await this.domain.template.findTemplateConfig();
        }
        return this.templateConfig;
    }

    buildGlobalConfig(customOptions: any = {}) {
        const template = this.domain.template.getTemplateRoot(this.templateConfig);
        this.globalConfig = defaultsDeep(customOptions, this.templateConfig.config, template.defaultConfig);

        this.domain.output.setConfig(this.globalConfig);

        return this.globalConfig;
    }

    async validateTemplates() {
        this.domain.template.validateAll(this.templates);
        return this;
    }

    async generate(data) {
        if (!this.templateConfig) error(DocGeneratorErrorType.BUILD_TEMPLATES_FIRST);
        // if (stream) this.options.stream = stream;
        // if (!this.options.stream) error(DocGeneratorErrorType.NO_STREAM);
        // if (!(this.options.stream instanceof WriteStream)) error(DocGeneratorErrorType.INCOMPATIBLE_STREAM);

        const generateStream = await this.getGenerateStream();
        await this.domain.template.generateAll(this.templates, data, generateStream);

        return this;
    }

    async getGenerateContent() {
        return await this.domain.file.getContent(this.generateStreamType());
    }

    async output() {
        const streamType = StreamType.OUTPUT;
        if (this.isOutputDiffFromGenerate()) {
            const content = await this.domain.file.getGenerateContent();

            const stream = await this.domain.file.getStream(streamType);
            const path = this.domain.file.getFullFilepath(streamType);

            const result = await this.domain.output.generate({ stream, content, path });
            if (result.path) {
                const _path = this.domain.file.readPathFromFullfilePath(streamType, result.path);
                this.domain.file.setProperty(streamType, 'filePath', _path);
            }
        }

        return this.getPath(streamType);
    }

    getGenerateStream() {
        return this.domain.file.getStream(this.generateStreamType());
    }

    generateStreamType() {
        return this.isOutputDiffFromGenerate() ? StreamType.GENERATE : StreamType.OUTPUT;
    }

    isOutputDiffFromGenerate() {
        return this.domain.output.readType() !== OutputType.PLAIN;
    }

    getPath(streamType) {
        return this.domain.file.getFullFilepath(streamType);
    }

    getOutputPath() {
        const streamType = StreamType.OUTPUT;
        return this.getPath(streamType);
    }
}
