import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configMultipleCsv, configMultipleHtml } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentMultipleCsvHead: TemplateContentEntity = {
    name: 'head',
    templateConfigId: configMultipleCsv.id,
    config: {
        type: TemplateType.CSV,
        order: 1,
    },
    options: {},
    content: `<%=data.header.join(';')%>`,
};
export const contentMultipleCsvBody: TemplateContentEntity = {
    name: 'body',
    templateConfigId: configMultipleCsv.id,
    config: {
        type: TemplateType.CSV,
        order: 2,
    },
    options: {},
    content: `<%=feed.id%>;<%=feed.name%>;<%=feed.email%>;<%=feed.birth%>;<%=feed.savings%>`,
};
export const contentMultipleCsvFooter: TemplateContentEntity = {
    name: 'footer',
    templateConfigId: configMultipleCsv.id,
    config: {
        type: TemplateType.CSV,
        order: 3,
    },
    options: {},
    content: `<%=outputs.body.savings%>`,
};
