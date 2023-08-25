import { TemplateType } from 'types/template';
import { ContentGenerator } from './content.abstract';

export class HtmlGenerator extends ContentGenerator {
    protected readonly baseType = TemplateType.HTML;
}
