import { OutputGenerator } from './output.abstract';
import { OutputType } from '../types/output';

export class PlainGenerator extends OutputGenerator {
    protected readonly baseType = OutputType.PLAIN;
    protected readonly needStream = false;
    protected readonly contentAsStream = false;

    public async generate(_params) {
        await this.prepare(_params);
        null;
    }
}

export default PlainGenerator;
