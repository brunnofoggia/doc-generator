import { DataSource } from 'typeorm';
import { DeepPartial } from 'node-common/dist/types/deepPartial';
import { DatabaseConnect } from '@test/utils/connect';
import { projectUid } from '@test/mock/entities/templateConfig';
import { TemplateService } from '@test/services/template.service';
import { TemplateConfigService } from '@test/services/templateConfig.service';
import { TemplateContentService } from '@test/services/templateContent.service';
import { templateMultipleFpdf } from '@test/mock/entities/template';
import { getServices } from '@test/utils/prepareData';
import { uniqueId } from 'lodash';
import { DocGeneratorDomain, getDefaultOptions } from '../domain/DocGenerator';
import { OutputType } from 'types/output';
import { findCook } from '../domain/Template.test';
import { DatabaseOptions } from 'interfaces/domain';
import { TemplateConfigInterface } from 'interfaces/entities';
import { FileDomain } from 'domain/File';
import { generate, output } from './kpdf.test';

describe('Domain > DocGenerator', () => {
    const uniqueName = 'FPDF';
    const dirPath = uniqueName;
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
    let sharedDomain: DocGeneratorDomain;
    const defaultTemplateWhere = {
        projectUid,
    };

    beforeAll(async () => {
        const fs = await FileDomain.getLocalFileSystem();
        await fs.deleteDirectory(dirPath);

        conn = await DatabaseConnect();
        const services = getServices(conn);
        templateService = services.templateService;
        templateConfigService = services.templateConfigService;
        templateContentService = services.templateContentService;
        templateConfig = await findCook(templateConfigService, defaultTemplateWhere, templateMultipleFpdf.uid)();
    });

    beforeEach(async () => {
        domain = new DocGeneratorDomain({
            templateConfig,
            file: {
                dirPath,
                generate: {
                    name: 'generate.tpl',
                },
                output: {
                    name: 'output.pdf',
                },
            },
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

    describe('output', () => {
        it('generate fpdf template', async () => {
            expect.assertions(1);

            const { title, content } = await generate({ uniqueName, domain });

            sharedDomain = domain;
            expect(content.indexOf(title)).toBeGreaterThan(0);
        });

        it('convert fpdf template to pdf', async () => {
            expect.assertions(1);

            const { line, stringExpected } = await output({ domain: sharedDomain });
            sharedDomain = null;
            expect(line).toContain(stringExpected);
        });
    });
});
