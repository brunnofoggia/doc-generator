import { DomainOptions } from './interfaces/domain';
import { DocGeneratorDomain } from './domain/DocGenerator';
import { DeepPartial } from 'typeorm';

export class DocGeneratorBuilder {
    domain: DocGeneratorDomain;

    async generate(options: DeepPartial<DomainOptions>, data = null) {
        this.domain = new DocGeneratorDomain(options);
        await this.domain.buildTemplatesList();
        await this.domain.validateTemplates();

        await this.domain.generate(data);
    }

    async generateAndOutput(options: DeepPartial<DomainOptions>, data = null) {
        await this.generate(options, data);
        return await this.domain.output();
    }
}
