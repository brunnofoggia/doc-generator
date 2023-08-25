import { TemplateContentEntity } from '../../entities/templateContent.entity';

import { contentSingleHtml } from './templateContent/singleHtml';
export * from './templateContent/singleHtml';

import { contentMultipleHtmlBody, contentMultipleHtmlFooter, contentMultipleHtmlHead } from './templateContent/multipleHtml';
export * from './templateContent/multipleHtml';

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
