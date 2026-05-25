
//
import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-11045.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 11045
    }
});
export {redisClient}