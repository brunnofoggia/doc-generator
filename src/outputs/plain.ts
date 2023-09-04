import { OutputGenerator } from './output.abstract';
import { OutputType } from 'types/output';

export class PlainGenerator extends OutputGenerator {
    protected readonly baseType = OutputType.PLAIN;
    protected readonly needStream = false;

    public async generate() {
        null;
    }
}
