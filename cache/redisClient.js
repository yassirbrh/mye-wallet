import { createClient } from 'redis';

let redisClient = createClient()
redisClient.connect().catch(console.error)

export default redisClient;