import ejs from 'ejs';
import { bind, defaults } from 'lodash';
import { WriteStreamInterface } from 'cloud-solutions/dist/common/interfaces/writeStream.interface';

import { TemplateGenerator } from './template.abstract';

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
        const seeder = input.data.seeder[this.getName()] || this.buildEmptySeeder();
        const calculator = input.data.calculator[this.getName()] || ((f) => f);

        await this.loopSeederFn(input, stream, seeder, calculator);
    }

    async loopSeederFn(input, stream: WriteStreamInterface, seeder, calculator) {
        let index = 0;
        const renderer = async (feed = null) => {
            input.options = this.data.options;
            input.feed = feed;
            input.index = index++;

            const rendered = await this.render(input);
            await stream.writeLine(rendered);
            await calculator(input);
        };

        await seeder(input, renderer);
    }

    buildEmptySeeder() {
        let count = 0;
        return async (input, renderer) => {
            await renderer();
            !count++;
        };
    }

    async render(input = {}) {
        if (!this.compiled) await this.validate();
        return this._render(this.compiled, input);
    }

    async _render(template, input) {
        return await template(input);
    }
}
