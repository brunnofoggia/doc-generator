import { DomainOptions } from 'interfaces/domain';
import { DocGeneratorDomain } from './domain/DocGenerator';

export class DocGeneratorBuilder {
    async build(options: DomainOptions) {
        const domain = new DocGeneratorDomain(options);
        await domain.buildTemplatesList();
        await domain.validateTemplates();
    }
}
