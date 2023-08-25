import dotenv from 'dotenv';
dotenv.config({ path: 'test/.env' });

import { DataSource, DataSourceOptions } from 'typeorm';

import { TemplateEntity } from '../entities/template.entity';
import { TemplateConfigEntity } from '../entities/templateConfig.entity';
import { TemplateContentEntity } from '../entities/templateContent.entity';
import { seed } from './prepareData';

export const databaseOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    entities: [TemplateEntity, TemplateConfigEntity, TemplateContentEntity],
    // logging: true,
};

export const createConnection = async () => {
    return new DataSource(databaseOptions);
};

let dataSource: DataSource;
export const DatabaseConnect = async () => {
    if (dataSource) return dataSource;

    dataSource = await createConnection();
    await dataSource.initialize();
    // console.log(`Connected to database ${databaseOptions.database}`);

    // const seed = (await import('./prepareData')).seed;
    await seed(dataSource);
    return dataSource;
};

export const DatabaseDisconnect = async () => {
    await dataSource?.destroy();
};
