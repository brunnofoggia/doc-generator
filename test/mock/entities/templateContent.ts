import { contentSingleHtml } from './templateContent/singleHtml';
export * from './templateContent/singleHtml';

import { contentMultipleHtmlBody, contentMultipleHtmlFooter, contentMultipleHtmlHead } from './templateContent/multipleHtml';
export * from './templateContent/multipleHtml';

import { contentMultipleFpdfLine1, contentMultipleFpdfLine2, contentMultipleFpdfLine3 } from './templateContent/multipleFpdf';
export * from './templateContent/multipleFpdf';

import { contentMultipleCsvBody, contentMultipleCsvFooter, contentMultipleCsvHead } from './templateContent/multipleCsv';
export * from './templateContent/multipleCsv';

import {
    contentRecursiveHtmlBody,
    contentRecursiveHtmlBodyDivA,
    contentRecursiveHtmlBodyDivB,
    contentRecursiveHtmlBodyDivC,
    contentRecursiveHtmlFooter,
    contentRecursiveHtmlHead,
} from './templateContent/recursiveHtml';
import { contentMultipleKpdfLine1, contentMultipleKpdfLine2, contentMultipleKpdfLine3 } from './templateContent/multipleKpdf';
export * from './templateContent/recursiveHtml';

// const model: TemplateContentEntity = {
//     name: '',
//     templateConfigId: 0,
//     config: {
//         type: '',
//         order: 0,
//     },
// };

// used to insert rows into db
export const templateContentList = [
    contentSingleHtml,
    contentMultipleHtmlHead,
    contentMultipleHtmlBody,
    contentMultipleHtmlFooter,
    contentMultipleKpdfLine1,
    contentMultipleKpdfLine2,
    contentMultipleKpdfLine3,
    contentMultipleFpdfLine1,
    contentMultipleFpdfLine2,
    contentMultipleFpdfLine3,
    contentMultipleCsvBody,
    contentMultipleCsvFooter,
    contentMultipleCsvHead,
    contentRecursiveHtmlHead,
    contentRecursiveHtmlBody,
    contentRecursiveHtmlFooter,
    contentRecursiveHtmlBodyDivA,
    contentRecursiveHtmlBodyDivB,
    contentRecursiveHtmlBodyDivC,
];
