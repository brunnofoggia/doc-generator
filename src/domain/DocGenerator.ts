import { defaultsDeep, size, cloneDeep } from 'lodash';
import { DeepPartial, ObjectLiteral } from 'typeorm';

import { DomainOptions } from '../interfaces/domain';
import { TemplateDomain } from './Template';
import { TemplateGenerator } from '../templates/template.abstract';
import { StreamType } from '../types/stream';
import { FileDomain } from './File';
import { DomainOptionsUtil } from '../utils/DomainOptions';
import { TemplateConfigInterface } from '../interfaces/entities';
import { OutputDomain } from './Output';
import { OutputType } from '../types/output';

const getDefaultOptions = (): DeepPartial<DomainOptions> => ({
    database: {
        relationsKeys: {
            template: 'template',
            contents: 'templateContents',
        },
        contentId: 'id',
        contentParentId: 'templateContentId',
        contentName: 'name',
    },
    file: {
        dirPath: 'doc-generator',
        name: '<%=streamType%>',
        baseDir: 'tmp',
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
        this.setTemplateConfig();
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
        if (!this.templates) {
            await this.buildGlobalConfig();

            this.templates = this.domain.template.buildTemplatesTree(
                this.domain.template.templatesFactory(
                    this.domain.template.normalizeTemplateContents(this.domain.template.getContents(this.templateConfig)),
                    this.globalConfig,
                ),
            );
        }
        return this;
    }

    setTemplateConfig(templateConfig: any = null) {
        !size(templateConfig) && (templateConfig = this.options.templateConfig);
        if (size(templateConfig)) {
            this.templateConfig = cloneDeep(templateConfig as TemplateConfigInterface);
            this.domain.template.setOptions({ templateConfig });
        }
        return this.templateConfig;
    }

    async buildGlobalConfig(customOptions: any = {}, replace = false) {
        this.setTemplateConfig();
        this.domain.template.checkTemplateConfig();

        if (!size(this.globalConfig) || replace) {
            const template = this.domain.template.getTemplateRoot(this.templateConfig);
            this.globalConfig = defaultsDeep(customOptions, this.templateConfig.config, template.defaultConfig);

            await this.domain.output.setConfig(this.globalConfig);
        }
        return this.globalConfig;
    }

    async validateTemplates() {
        this.domain.template.validateAll(this.templates);
        return this;
    }

    async generate(data) {
        await this.buildTemplatesList();
        await this.validateTemplates();

        const generateStream = await this.getGenerateStream();
        await this.domain.template.generateAll(this.templates, data, generateStream);

        return { path: this.getPath(StreamType.GENERATE) };
    }

    async getGenerateContent() {
        return await this.domain.file.getContent(this.generateStreamType());
    }

    async output() {
        const streamType = StreamType.OUTPUT;
        if (this.isOutputDiffFromGenerate()) {
            const content = await this.domain.file.getGenerateContent();

            const fs = await this.domain.file.setFileSystem(streamType);
            const stream = this.domain.output.isStreamNeed() ? await this.domain.file.getStream(streamType) : null;
            const path = this.domain.file.getFullFilepath(streamType);

            const result = await this.domain.output.generate({ fileSystem: fs, stream, content, path });

            if (result.path) {
                const _path = this.domain.file.readPathFromFullfilePath(streamType, result.path);
                this.domain.file.setProperty(streamType, 'filePath', _path);
            }
        }

        return { path: this.getPath(streamType) };
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
