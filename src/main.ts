import Facebook from "./modules/Facebook/Facebook";
import * as Nightmare  from "nightmare";
import * as fs  from "fs";
import { chainPromiseFn, getRandomInt } from "./utils/utils";
import { solveCheckpointBlock } from "./Area/Errors/CheckpointBlock/CheckpointBlock";
type Auth = {
    email: string, 
    password: string
}
export default class Main {
    constructor() {
        console.log('facebook-crawling-nightmare launched');
        const   userAgents: string[] = require('user-agent-array'),
                nightmare = 
                new Nightmare({show:true})
                    .viewport(1200, 950)
                    .useragent(
                        true 
                        ? "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
                        : userAgents[getRandomInt(0,userAgents.length-1)]
                    ),
                    //Googlebot/2.1 (+http://www.google.com/bot.html)
                facebookAuth = new Facebook(nightmare,"kh7ir",100009374775830);
        console.log(nightmare.engineVersions());
        const auth:Auth = JSON.parse(fs.readFileSync('./src/auth.json', 'utf8'))
        const app = facebookAuth.authPage(nightmare, auth.email, auth.password);
        app.then((e: any)=>{
            console.log("---->",e);
            chainPromiseFn([
                () => solveCheckpointBlock(nightmare),
                () => facebookAuth.getPerson(nightmare),
                () => facebookAuth.getPost(nightmare),
                () => facebookAuth.getAlbum(nightmare),
                () => facebookAuth.getPhoto(nightmare),
                () => Promise.resolve(nightmare.end())
            ])
            .then(console.log);
        })
    }
}
const main = new Main();