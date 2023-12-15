import { ObjectLiteral } from 'node-common/dist/types/objectLiteral';

import { TemplateType } from '../types/template';

export interface TemplateInterface {
    uid: string;
    defaultConfig: ObjectLiteral;
}

export interface TemplateContentConfigInterface {
    type: TemplateType;
    order: number;
    ejsConfig?: any;
}

export interface TemplateConfigInterface {
    templateUid: string;
    config?: any;
    templateContents: TemplateContentInterface[];
}

export interface TemplateContentInterface {
    config: TemplateContentConfigInterface;
    options: ObjectLiteral;
    content: string;
    templateContents: TemplateContentInterface[];
}

export interface TemplateContentObjectListInterface {
    [x: string]: TemplateContentInterface;
}
