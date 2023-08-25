export const getNormalizedContents = async function ({ templateDomain, defaultTemplateWhere, templateUid }) {
    const templateWhere = { ...defaultTemplateWhere, templateUid };
    templateDomain.setOptions({ templateWhere });
    const templateConfig = await templateDomain.findTemplateConfig();
    return templateDomain.normalizeTemplateContents(templateConfig.templateContents);
};

export const getTemplateGenerators = async function ({ templateDomain, defaultTemplateWhere, templateUid }) {
    const normalizedContents = await getNormalizedContents({
        templateDomain,
        defaultTemplateWhere,
        templateUid,
    });
    return getTemplateGeneratorsFromContents({ templateDomain, normalizedContents });
};

export const getTemplateGeneratorsFromContents = function ({ templateDomain, normalizedContents }) {
    return templateDomain.templatesFactory(normalizedContents, {});
};
