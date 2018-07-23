import * as fs  from "fs";

type Auth = {
    email: string, 
    password: string
}
export const auth:Auth = JSON.parse(fs.readFileSync('./src/config/resource/auth.config.json', 'utf8'));