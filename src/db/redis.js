import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13740.crce283.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 13740
    }
});

export {redisClient}