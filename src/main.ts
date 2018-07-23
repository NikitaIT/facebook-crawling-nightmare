import Facebook from "./modules/Facebook/Facebook";
import * as Nightmare  from "nightmare";
import * as fs  from "fs";
import { chainPromiseFn, getRandomInt } from "./utils/utils";
import { solveCheckpointBlock } from "./Area/Errors/CheckpointBlock/CheckpointBlock";
import { nightmare } from "./config/nightmare.config";
import { auth } from "./config/auth.config";

export default class Main {
    constructor() {
        console.log('facebook-crawling-nightmare launched');
        const facebookAuth = new Facebook(nightmare,"kh7ir");
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