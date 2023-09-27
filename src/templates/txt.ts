import { TemplateType } from '../types/template';
import { ContentGenerator } from './content.abstract';

export class TxtGenerator extends ContentGenerator {
    protected readonly baseType = TemplateType.TXT;
}
