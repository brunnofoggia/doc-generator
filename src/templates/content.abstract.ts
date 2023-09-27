import ejs from 'ejs';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

import { TemplateGenerator } from './template.abstract';
import { defaults } from 'lodash';

export abstract class ContentGenerator extends TemplateGenerator {
    protected compiled: any;
    protected static ejsOptions = {
        async: true,
    };
    protected ejsOptions: any;

    buildEjsOptions() {
        if (!this.ejsOptions)
            this.ejsOptions = defaults(this.data.config.ejsConfig || {}, this.globalConfig.ejsOptions || {}, ContentGenerator.ejsOptions);
    }

    async validate() {
        this.buildEjsOptions();
        this.compiled = await this._validate(this.data.content, this.ejsOptions);
    }

    async _validate(content, ejsOptions = {}) {
        return await ejs.compile(content, ejsOptions);
    }

    async generate(input, stream: WriteStreamInterface) {
        const seeder = input.data.seeder[this.getName()] || this.buildSeeder();
        const calculator = input.data.calculator[this.getName()] || ((f) => f);

        while ((input.feed = await seeder(input))) {
            const rendered = await this.render(input);
            await stream.writeLine(rendered);
            await calculator(input);
        }
    }

    buildSeeder() {
        let count = 0;
        return () => !count++;
    }

    async render(input = {}) {
        if (!this.compiled) await this.validate();
        return this._render(this.compiled, input);
    }

    async _render(template, input) {
        return await template(input);
    }
}
