import { DynamicDatabase } from 'node-labs/lib/services/dynamicDatabase.service';

import { TemplateConfigEntity } from '../entities/templateConfig.entity';

export class TemplateConfigService extends DynamicDatabase<TemplateConfigEntity> {
    protected entity = TemplateConfigEntity;
}
