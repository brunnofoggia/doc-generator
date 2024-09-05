import { DataSource } from 'typeorm';
import { DeepPartial } from '../common/types/deepPartial';
import { DatabaseConnect } from '@test/utils/connect';
import { configSingleHtml, projectUid } from '@test/mock/entities/templateConfig';
import { TemplateService } from '@test/services/template.service';
import { TemplateConfigService } from '@test/services/templateConfig.service';
import { TemplateContentService } from '@test/services/templateContent.service';
import { templateSingleHtml } from '@test/mock/entities/template';
import { getServices } from '@test/utils/prepareData';
import { defaultsDeep, uniqueId } from 'lodash';
import { DocGeneratorDomain, getDefaultOptions } from './DocGenerator';
import { OutputType } from 'types/output';
import { findCook } from './Template.test';
import { DatabaseOptions } from 'interfaces/domain';
import { TemplateConfigInterface } from 'interfaces/entities';
import { sleep } from 'common/utils';
import { StreamType } from 'types/stream';

describe('Domain > DocGenerator', () => {
    const uniqueName = 'DocGenerator';
    let conn: DataSource;
    let templateService: TemplateService;
    let templateConfigService: TemplateConfigService;
    let templateContentService: TemplateContentService;
    let templateConfig: TemplateConfigInterface;

    let path;
    let sharedTitle;
    let sharedDomainOptions;
    const configRelations = {
        template: 'template',
        contents: 'templateContents',
    };
    const databaseConfig: DeepPartial<DatabaseOptions> = {
        relationsKeys: configRelations,
        contentId: 'id',
        contentParentId: 'templateContentId',
        contentName: 'name',
    };

    let domain: DocGeneratorDomain;
    const defaultTemplateWhere = {
        projectUid,
    };

    function setCustomOptions(reset = false) {
        if (!reset && sharedTitle && sharedDomainOptions) {
            return;
        }

        sharedTitle = [uniqueId(uniqueName), new Date().toISOString()].join('-');
        sharedDomainOptions = {
            file: {
                dirPath: [getDefaultOptions().file.dirPath, sharedTitle].join('/'),
                generate: {
                    name: 'generate.html',
                },
                output: {
                    name: 'output.pdf',
                },
            },
        };
    }
    setCustomOptions(true);

    async function htmlGenerate() {
        await domain.buildTemplatesList();
        domain.setOptions(sharedDomainOptions);

        await domain.validateTemplates();
        const input = { title: sharedTitle };

        try {
            const { path: path_ } = await domain.generate(input);
            path = path_;

            const content = await domain.getGenerateContent();
            return { path, content, domain };
        } catch (error) {
            console.error('error', error);
            console.log('stack', error.stack);
        }
    }

    beforeAll(async () => {
        conn = await DatabaseConnect();
        const services = getServices(conn);
        templateService = services.templateService;
        templateConfigService = services.templateConfigService;
        templateContentService = services.templateContentService;
        templateConfig = await findCook(templateConfigService, defaultTemplateWhere, templateSingleHtml.uid)();
    });

    beforeEach(async () => {
        domain = new DocGeneratorDomain({
            templateConfig,
        });
    });

    describe('variables and data ready', () => {
        it('database connected', () => {
            expect(conn).toBeDefined();
        });

        it('domain defined', () => {
            expect(domain).toBeDefined();
        });
    });

    describe('global config', () => {
        it('merging config from template and templateConfig', async () => {
            expect.assertions(1);

            const globalConfig1 = await domain.buildGlobalConfig();
            const globalConfig2 = defaultsDeep(configSingleHtml.config, templateSingleHtml.defaultConfig);

            expect(globalConfig1).toEqual(globalConfig2);
        });
    });

    describe('output', () => {
        it('generate plain html and output', async () => {
            expect.assertions(2);

            const title = uniqueId(uniqueName);
            const path = await domain.generate({ title });
            const content = await domain.getGenerateContent();

            expect(content.indexOf(title)).toBeGreaterThan(0);
            expect(content.indexOf('</html>')).toBeGreaterThan(0);
        });

        it('generate html into random path', async () => {
            expect.assertions(2);

            try {
                const { content } = await htmlGenerate();
                expect(content.indexOf(sharedTitle)).toBeGreaterThan(0);
                expect(content.indexOf('</html>')).toBeGreaterThan(0);
            } catch (error) {
                console.error('error', error);
                console.log('stack', error.stack);
            }
        });

        // TODO: change to convert functions to pdf
        // it.only('convert html to pdf', async () => {
        //     expect.assertions(2);
        //     const { content: html, domain } = await htmlGenerate();

        //     // customize output
        //     domain.buildGlobalConfig(
        //         {
        //             outputType: OutputType.PPDF,
        //         },
        //         true,
        //     );

        //     const streamTypeGen = StreamType.GENERATE;
        //     domain.getChild().file.setFilepath(streamTypeGen);
        //     await domain.getChild().file.setFileSystem(streamTypeGen);

        //     const { path } = await domain.output();

        //     const streamTypeOut = StreamType.OUTPUT;
        //     const fs = await domain.getChild().file.getProperty(streamTypeOut, 'fileSystem');
        //     const fsPath = domain.getChild().file.getProperty(streamTypeOut, 'filePath');
        //     const content = await fs.readContent(fsPath);

        //     expect(path.indexOf('.pdf')).toBeGreaterThan(0);
        //     expect(content.indexOf('%PDF-1.')).toEqual(0);
        // });
    });
});
