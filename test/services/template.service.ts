import { DynamicDatabase } from 'node-labs/lib/services/dynamicDatabase.service';

import { TemplateEntity } from '../entities/template.entity';

export class TemplateService extends DynamicDatabase<TemplateEntity> {
    protected idAttribute = 'uid';
    protected entity = TemplateEntity;
}
