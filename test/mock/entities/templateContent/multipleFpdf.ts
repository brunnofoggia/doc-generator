import { TemplateContentEntity } from '@test/entities/templateContent.entity';
import { configMultipleFpdf } from '../templateConfig';
import { TemplateType } from '../../../../src/types/template';

export const contentMultipleFpdfLine1: TemplateContentEntity = {
    name: 'line1',
    templateConfigId: configMultipleFpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 1,
    },
    options: {},
    content: `SetAutoPageBreak###[true, 3]
        SetFont###["Arial", "B", 12]
        `,
};
export const contentMultipleFpdfLine2: TemplateContentEntity = {
    name: 'line2',
    templateConfigId: configMultipleFpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 2,
    },
    options: {},
    content: `
    AddPage
    SetFont###["times", "B", 16]
    SetY###[2]
    SetX###[2]
    Cell###[0, 5, "<%=data.title%>: Lorem Ipsum is simply dummy text (\\"standard\\")", 0, 1, "C"]

    SetFont###["Arial", "B", 12]
    Cell###[0, 5, "", 0, 1, "L"]
    Cell###[0, 5, "I - Lorem", 1, 1, "L"]

    SetFont###["Arial", "B", 10]
    MultiCell###[0, 5, "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.  (\\"standard\\").", 1, "L"]
    `,
};
export const contentMultipleFpdfLine3: TemplateContentEntity = {
    name: 'line3',
    templateConfigId: configMultipleFpdf.id,
    config: {
        type: TemplateType.TXT,
        order: 3,
    },
    options: {},
    content: `
    SetFont###["Arial", "B", 12]
    Cell###[0, 5, "", 0, 1, "L"]
    Cell###[0, 5, "II - Ipsum", 1, 1, "L"]
    SetFont###["Arial", "", 10]
    Cell###[0, 5, "Lipsum: xxxxxxxxxx xxxxxxxxxxxx", 1, 0,"L"]
    `,
};
