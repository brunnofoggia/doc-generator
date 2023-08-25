import { TemplateType } from 'types/template';
import { ContentGenerator } from './content.abstract';

export class CsvGenerator extends ContentGenerator {
    protected readonly baseType = TemplateType.CSV;
}
