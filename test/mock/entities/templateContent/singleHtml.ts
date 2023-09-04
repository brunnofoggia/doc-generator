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
    <html><head></head><body>
        <h1 style="color: #000; fonte-size: 20px;">HTML</h1>
        <div style="color: #000; fonte-size: 20px;"><%=data.title%></div>
    </body></html>
    `,
};
