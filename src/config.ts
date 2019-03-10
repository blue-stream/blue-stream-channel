export const config = {
    rpc: {
        port: +(process.env.RPC_PORT || 6001),
    },
    db: {
        connectionString: `mongodb://${process.env.DB_SERVERS || 'localhost:27017'}/${process.env.CHANNELS_DB_NAME || 'blue-stream-channel'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
    },
    logger: {
        durable: false,
        exchangeType: process.env.RMQ_LOGGER_TYPE || 'topic',
        exchange: process.env.RMQ_LOGGER_EXCHANGE || 'blue_stream_logs',
        host: process.env.RMQ_LOGGER_HOST || 'localhost',
        port: +(process.env.RMQ_LOGGER_PORT || 15672),
        password: process.env.RMQ_LOGGER_PASS || 'guest',
        username: process.env.RMQ_LOGGER_USER || 'guest',
        persistent: false,
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
    },
    server: {
        port: +(process.env.PORT || 3000),
        name: 'channel',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
    channel: {
        name: {
            minLength: +(process.env.NAME_MAX_LENGTH || 2),
            maxLength: +(process.env.NAME_MAX_LENGTH || 32),
        },
        description: {
            minLength: +(process.env.DESCRIPTION_MAX_LENGTH || 2),
            maxLength: +(process.env.DESCRIPTION_MAX_LENGTH || 128),
        },
        defaultAmountOfResults: +(process.env.DEFAULT_RESULTS_AMOUNT || 20),
    },
};
