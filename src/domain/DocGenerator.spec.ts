import { DataSource, DeepPartial } from 'typeorm';
import { DatabaseConnect } from '@test/utils/connect';
import { configSingleHtml, projectUid, templateConfigList } from '@test/mock/entities/templateConfig';
import { TemplateService } from '@test/services/template.service';
import { TemplateConfigService } from '@test/services/templateConfig.service';
import { TemplateContentService } from '@test/services/templateContent.service';
import { templateList, templateRecursiveHtml, templateSingleHtml } from '@test/mock/entities/template';
import { getServices } from '@test/utils/prepareData';
import { templateContentList } from '@test/mock/entities/templateContent';
import { each, size, isArray, defaultsDeep, uniqueId } from 'lodash';
import { getError } from 'utils';
import { DocGeneratorErrorType } from '../types/error';
import { TemplateGenerator } from 'templates/template.abstract';
import { DocGeneratorDomain } from './DocGenerator';
import { OutputType } from 'types/output';
import { findCook } from './Template.test';
import { DatabaseOptions, DomainOptions } from 'interfaces/domain';
import { TemplateConfigInterface } from 'interfaces/entities';

describe('Domain > DocGenerator', () => {
    const uniqueName = 'DocGenerator';
    let conn: DataSource;
    let templateService: TemplateService;
    let templateConfigService: TemplateConfigService;
    let templateContentService: TemplateContentService;
    let templateConfig: TemplateConfigInterface;
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

            const globalConfig1 = domain.buildGlobalConfig();
            const globalConfig2 = defaultsDeep(configSingleHtml.config, templateSingleHtml.defaultConfig);

            expect(globalConfig1).toEqual(globalConfig2);
        });
    });

    describe('output', () => {
        it('generate plain html and output', async () => {
            expect.assertions(1);

            const title = uniqueId(uniqueName);
            await domain.generate({ title });
            const content = await domain.getGenerateContent();

            expect(content.indexOf(title)).toBeGreaterThan(0);
        });

        it('generate plain html and convert to pdf', async () => {
            expect.assertions(1);

            const title = [uniqueId(uniqueName), new Date().toISOString()].join('-');
            await domain.buildTemplatesList();

            // customize options
            domain.setOptions({
                file: {
                    dirPath: title,
                },
            });

            // customize output
            domain.buildGlobalConfig({
                outputType: OutputType.PDF,
            });

            await domain.validateTemplates();
            const input = { title };
            await domain.generate(input);
            const content = await domain.getGenerateContent();
            await domain.output();

            expect(content.indexOf(title)).toBeGreaterThan(0);
        });
    });
});
