import { DynamicDatabase } from 'node-labs/lib/services/dynamicDatabase.service';

import { TemplateContentEntity } from '../entities/templateContent.entity';

export class TemplateContentService extends DynamicDatabase<TemplateContentEntity> {
    protected entity = TemplateContentEntity;
}
