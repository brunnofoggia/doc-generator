import { OutputType } from '../../../src/types/output';
import { TemplateEntity } from '../../entities/template.entity';

const model: TemplateEntity = {
    uid: '',
    defaultConfig: {},
};

export const templateSingleHtml: TemplateEntity = {
    uid: 'singleHtml',
    defaultConfig: {
        x: 1,
        y: 2,
    },
};

export const templateMultipleHtml: TemplateEntity = {
    uid: 'multipleHtml',
    defaultConfig: {},
};

export const templateMultipleKpdf: TemplateEntity = {
    uid: 'multipleKpdf',
    defaultConfig: {
        outputType: OutputType.KPDF,
        outputConfig: {
            // libInstanceParams: [{}],
        },
    },
};

export const templateMultipleFpdf: TemplateEntity = {
    uid: 'multipleFpdf',
    defaultConfig: {
        outputType: OutputType.FPDF,
    },
};

export const templateMultipleCsv: TemplateEntity = {
    uid: 'multipleCsv',
    defaultConfig: {},
};

export const templateRecursiveHtml: TemplateEntity = {
    uid: 'recursiveHtml',
    defaultConfig: {},
};

// used to insert rows into db
export const templateList = [
    templateSingleHtml,
    templateMultipleHtml,
    templateMultipleKpdf,
    templateMultipleFpdf,
    templateMultipleCsv,
    templateRecursiveHtml,
];
