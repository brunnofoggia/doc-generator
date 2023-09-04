import { TemplateContentInterface } from 'interfaces/entities';
import { TemplateType } from 'types/template';
import { each, sortBy } from 'lodash';
import { ObjectLiteral } from 'typeorm';

export interface TemplateGeneratorSetup {
    data: TemplateContentInterface;
    id: number;
    name: string;
    parentId: number;
    globalConfig: ObjectLiteral;
}

export abstract class TemplateGenerator {
    protected abstract baseType: TemplateType;

    protected id: number;
    protected name: string;
    protected parentId = 0;
    protected data: TemplateContentInterface;
    protected type: TemplateType;
    protected order: number;
    protected globalConfig: ObjectLiteral;

    protected children: TemplateGenerator[] = [];

    constructor(params: TemplateGeneratorSetup) {
        this.set(params);
    }

    set({ data, id, name, parentId, globalConfig }: TemplateGeneratorSetup) {
        this.data = data;
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.order = data.config.order;
        this.type = data.config.type;
        this.globalConfig = globalConfig;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getParentId() {
        return this.parentId;
    }

    getOrder() {
        return this.order;
    }

    getType() {
        return this.type;
    }

    getBaseType() {
        return this.baseType;
    }

    addChildren(child: TemplateGenerator) {
        this.children.push(child);
        return this;
    }

    getChildrenLength() {
        return this.children.length;
    }

    sortChildren() {
        this.children = sortBy(this.children, (child) => child.getOrder());
        return this;
    }

    async validateRecursively() {
        for (const child of this.children) {
            await child.validate();
        }
        await this.validate();
    }

    async generateRecursively(data, stream, outputs: any = {}) {
        !data.seeder && (data.seeder = {});
        !data.calculator && (data.calculator = {});

        for (const child of this.children) {
            await this.generateWithOutput(child, data, stream, outputs);
        }

        await this.generateWithOutput(this, data, stream, outputs);
        return outputs;
    }

    async generateWithOutput(template, data, stream, outputs) {
        const output = {};
        await template.generate({ data, output, outputs }, stream);
        outputs[template.getName()] = output;
        return output;
    }

    public abstract validate();
    public abstract generate(data, stream);
}
