import { cloneDeep, defaultsDeep, each } from 'lodash';
import { DeepPartial } from 'typeorm';
import { DomainOptions } from '../interfaces/domain';

export abstract class DomainOptionsUtil {
    protected options: DeepPartial<DomainOptions> = {};
    protected domain: any = {};

    constructor(options: DeepPartial<DomainOptions> = {}, defaultOptions: DeepPartial<DomainOptions> = {}) {
        this.setChild();
        this.options = cloneDeep(defaultOptions);
        this.setOptions(options);
    }

    copyOfOptions(_options: DeepPartial<DomainOptions>) {
        this.options = _options;
        this.setChildCopyOfOptions(this.getChild(), this.options);
    }

    setOptions(_options: DeepPartial<DomainOptions>) {
        this.options = defaultsDeep({}, _options, this.options);
        this.setChildCopyOfOptions(this.getChild(), this.options);
    }

    setChild() {
        return [];
    }

    getChild() {
        return this.domain;
    }

    setChildCopyOfOptions(childList: any[], _options: DeepPartial<DomainOptions>) {
        each(childList, (child) => child.copyOfOptions(_options));
    }
}
