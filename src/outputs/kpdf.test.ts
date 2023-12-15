import { FileDomain } from '../domain/File';
import { uniqueId } from 'lodash';

export async function generate({ uniqueName, domain }) {
    const title = uniqueId(uniqueName);

    await domain.generate({
        title,
    });

    const content = await domain.getGenerateContent();
    return { title, content };
}

export async function output({ domain }) {
    const { path } = await domain.output();
    const fs = await FileDomain.getLocalFileSystem();
    const stream = await fs.readStream(path.substring(fs.getOptions().baseDir.length + 1));

    let line = '';
    for await (const line_ of stream) {
        line = line_;
        break;
    }

    return { line, stringExpected: '%PDF' };
}
