import { DomainOptions } from 'interfaces/domain';
import { DocGeneratorDomain } from './domain/DocGenerator';

export class DocGeneratorBuilder {
    protected domain: DocGeneratorDomain;

    async generate(options: DomainOptions, data = null) {
        this.domain = new DocGeneratorDomain(options);
        await this.domain.buildTemplatesList();
        await this.domain.validateTemplates();

        await this.domain.generate(data);
        return await this.domain.output();
    }
}
