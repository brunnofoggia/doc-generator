import { cloneDeep, defaultsDeep, each } from 'lodash';
import { DomainOptions } from '../interfaces/domain';

export abstract class DomainOptionsUtil {
    protected options: Partial<DomainOptions> = {};
    protected domain: any = {};

    constructor(options: Partial<DomainOptions> = {}, defaultOptions: Partial<DomainOptions> = {}) {
        this.setChild();
        this.options = cloneDeep(defaultOptions);
        this.setOptions(options);
    }

    copyOfOptions(_options: Partial<DomainOptions>) {
        this.options = _options;
        this.setChildCopyOfOptions(this.getChild(), this.options);
    }

    setOptions(_options: Partial<DomainOptions>) {
        this.options = defaultsDeep({}, _options, this.options);
        this.setChildCopyOfOptions(this.getChild(), this.options);
    }

    setChild() {
        return [];
    }

    getChild() {
        return this.domain;
    }

    setChildCopyOfOptions(childList: any[], _options: Partial<DomainOptions>) {
        each(childList, (child) => child.copyOfOptions(_options));
    }
}
