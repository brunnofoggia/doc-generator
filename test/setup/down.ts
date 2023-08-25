import { DatabaseDisconnect } from '../utils/connect';

export default async () => {
    await DatabaseDisconnect();
    process.exit();
};
