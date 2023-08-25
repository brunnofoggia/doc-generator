import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configMultipleHtml } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentMultipleHtmlHead: TemplateContentEntity = {
    name: 'head',
    templateConfigId: configMultipleHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 1,
    },
    options: {},
    content: `<html><head><title>Multiple Title</title></head>`,
};
export const contentMultipleHtmlBody: TemplateContentEntity = {
    name: 'body',
    templateConfigId: configMultipleHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 2,
    },
    options: {},
    content: `<body>Multiple Html: Some Content</body>`,
};
export const contentMultipleHtmlFooter: TemplateContentEntity = {
    name: 'footer',
    templateConfigId: configMultipleHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 3,
    },
    options: {},
    content: `</html>`,
};
