import { defaultsDeep } from 'lodash';

export const findCook = (templateConfigService, defaultTemplateWhere, uid = '') => {
    const where: any = defaultsDeep({}, defaultTemplateWhere);
    if (uid) where.templateUid = uid;
    return () =>
        templateConfigService.find({
            where,
            relations: {
                template: true,
                templateContents: true,
            },
            take: 1,
        });
};

export const getNormalizedContents = async function ({ templateDomain, templateConfigService, defaultTemplateWhere, templateUid }) {
    templateDomain.setOptions({ database: { find: findCook(templateConfigService, defaultTemplateWhere, templateUid) } });

    const templateConfig = await templateDomain.findTemplateConfig();
    return templateDomain.normalizeTemplateContents(templateConfig.templateContents);
};

export const getTemplateGenerators = async function ({ templateDomain, templateConfigService, defaultTemplateWhere, templateUid }) {
    const normalizedContents = await getNormalizedContents({
        templateDomain,
        templateConfigService,
        defaultTemplateWhere,
        templateUid,
    });
    return getTemplateGeneratorsFromContents({ templateDomain, normalizedContents });
};

export const getTemplateGeneratorsFromContents = function ({ templateDomain, normalizedContents }) {
    return templateDomain.templatesFactory(normalizedContents, {});
};
