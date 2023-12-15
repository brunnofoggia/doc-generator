import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configMultipleKpdf } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentMultipleKpdfLine1: TemplateContentEntity = {
    name: 'line1',
    templateConfigId: configMultipleKpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 1,
    },
    options: {},
    content: `
        fontSize###[12]
        text###["Lorem Ipsum is simply dummy text of the printing and typesetting industry (\\"<%=data.title%>\\")", 0, 5]
        `,
};
export const contentMultipleKpdfLine2: TemplateContentEntity = {
    name: 'line2',
    templateConfigId: configMultipleKpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 2,
    },
    options: {},
    content: `
    fontSize###[12]
    text###["I - Ipsum", 0, 200]

    fontSize###[12]
    text###["XXXXXXXXXXXXXXXX Lorem Ipsum is simply dummy text of the printing and typesetting industry (\\"XXXX\\"), Lorem Ipsum is simply dummy text of the printing and typesetting industry XXXXXXXXXXXXXXX.", 0, 50]
    `,
};
export const contentMultipleKpdfLine3: TemplateContentEntity = {
    name: 'line3',
    templateConfigId: configMultipleKpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 3,
    },
    options: {},
    content: `
    fontSize###[12]
    text###["II - Lorem", 20, 100]
    fontSize###[10]
    text###["Lipsum: xxxxxxxxxx xxxxxxxxxxxx", 60, 150]
    `,
};
