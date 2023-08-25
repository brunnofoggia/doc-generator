import { DataSource } from 'typeorm';
import { DatabaseConnect } from '@test/utils/connect';
import { configSingleHtml, projectUid, templateConfigList } from '@test/mock/entities/templateConfig';
import { TemplateService } from '@test/services/template.service';
import { TemplateConfigService } from '@test/services/templateConfig.service';
import { TemplateContentService } from '@test/services/templateContent.service';
import { templateList, templateRecursiveHtml, templateSingleHtml } from '@test/mock/entities/template';
import { getServices } from '@test/utils/prepareData';
import { templateContentList } from '@test/mock/entities/templateContent';
import { each, size, isArray, defaultsDeep } from 'lodash';
import { getError } from 'utils';
import { DocGeneratorErrorType } from '../types/error';
import { TemplateGenerator } from 'templates/template.abstract';
import { DocGeneratorDomain } from './DocGenerator';

describe('Domain > DocGenDomain', () => {
    let conn: DataSource;
    let templateService: TemplateService;
    let templateConfigService: TemplateConfigService;
    let templateContentService: TemplateContentService;
    const configRelations = {
        template: 'template',
        contents: 'templateContents',
    };
    const databaseConfig = {
        configRelations,
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

        domain = new DocGeneratorDomain({
            templateService,
            templateConfigService,
            templateContentService,
            database: databaseConfig,
        });
    });

    beforeEach(() => {
        const templateWhere = { ...defaultTemplateWhere, templateUid: templateSingleHtml.uid };
        domain.setOptions({ templateWhere });
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
            const templateConfig = await domain.findTemplateConfig();
            const globalConfig1 = domain.buildGlobalConfig(templateConfig);
            const globalConfig2 = defaultsDeep(configSingleHtml.config, templateSingleHtml.defaultConfig);

            expect(globalConfig1).toEqual(globalConfig2);
        });
    });

    describe('generate', () => {
        it('null stream throw error', async () => {
            expect(domain.generate({})).rejects.toThrowError(getError(DocGeneratorErrorType.NO_STREAM));
        });
    });
});
