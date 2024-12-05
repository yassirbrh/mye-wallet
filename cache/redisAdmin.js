import { createClient } from "redis";

let redisAdmin = createClient()
redisAdmin.connect().catch(console.error)

export default redisAdmin;