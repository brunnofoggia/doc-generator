import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configSingleHtml } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentSingleHtml: TemplateContentEntity = {
    name: 'singleHtml',
    templateConfigId: configSingleHtml.id,
    config: {
        type: TemplateType.HTML,
        order: 0,
    },
    options: {},
    content: `
        <h1>HTML</h1>
        <div><%=data.title%></div>
    `,
};
