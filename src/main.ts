import Facebook from "./modules/Facebook/Facebook";
import * as Nightmare  from "nightmare";
import * as fs  from "fs";
import { chainPromiseFn } from "./utils/utils";
type Auth = {
    email: string, 
    password: string
}
export default class Main {
    constructor() {
      console.log('Typescript Main launched');
        const   nightmare = new Nightmare({show:true}),
                facebookAuth = new Facebook(nightmare,"kh7ir",100009374775830);
        console.log(nightmare.engineVersions());
        const auth:Auth = JSON.parse(fs.readFileSync('./src/auth.json', 'utf8'))
        const app = facebookAuth.authPage(nightmare, auth.email, auth.password);
        app.then((e: any)=>{
            console.log("---->",e);
            chainPromiseFn([
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