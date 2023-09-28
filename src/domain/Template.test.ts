import { defaultsDeep } from 'lodash';

export const findCook = (templateConfigService, defaultTemplateWhere, uid = '') => {
    const where: any = defaultsDeep({}, defaultTemplateWhere);
    if (uid) where.templateUid = uid;
    return async () =>
        (
            (await templateConfigService.find({
                where,
                relations: {
                    template: true,
                    templateContents: true,
                },
                take: 1,
            })) || []
        ).shift() || {};
};

export const getNormalizedContents = async function ({ templateDomain, templateConfigService, defaultTemplateWhere, templateUid }) {
    const templateConfig = await findCook(templateConfigService, defaultTemplateWhere, templateUid)();
    templateDomain.setOptions({ templateConfig });
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
