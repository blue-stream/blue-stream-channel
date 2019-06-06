import * as mongoose from 'mongoose';
import * as rabbit from '@bit/blue-stream.utils.rabbit';
import { Server } from './server';
import { Logger, log } from '@bit/blue-stream.utils.logger';
import { config } from './config';
import { RPCServer } from './channel/channel.rpc';

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err.stack);

    rabbit.closeConnection();
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection', err);

    rabbit.closeConnection();
    process.exit(1);
});

process.on('SIGINT', async () => {
    try {
        console.log('User Termination');

        await mongoose.disconnect();
        rabbit.closeConnection();
        process.exit(0);
    } catch (error) {
        console.error('Faild to close connections', error);
    }
});

(async () => {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect(
        config.db.connectionString,
        { useNewUrlParser: true },
    );

    Logger.init(config.server.name, { indexPrefix: config.logger.indexPrefix, clientOpts: config.logger.elasticsearch, });
    console.log('[MongoDB] connected');

    log('verbose', 'Server Started', `Port: ${config.server.port}`);
    await rabbit.connect(config.rabbitMQ);

    console.log('Starting RPC Server');
    RPCServer.http().listen(config.rpc.port, function () {
        console.log(`RPC server running on port ${config.rpc.port}`);
    });

    console.log('Starting server');
    const server: Server = Server.bootstrap();

    server.app.on('close', () => {

        rabbit.closeConnection();

        mongoose.disconnect();
        console.log('Server closed');
    });
})();
