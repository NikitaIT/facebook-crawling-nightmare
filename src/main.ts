import Facebook from "./modules/Facebook/Facebook";
import * as Nightmare  from "nightmare";
import * as fs  from "fs";
type Auth = {
    email: string, 
    password: string
}
export default class Main {
    static facebookAuth = new Facebook();
    constructor() {
      console.log('Typescript Main launched');
      //https://www.facebook.com/100009374775830
        const nightmare = new Nightmare({show:true});
        //Main.facebookAuth.test(nightmare);
        const auth:Auth = JSON.parse(fs.readFileSync('./src/auth.json', 'utf8'))
        const app = Main.facebookAuth.authPage(nightmare, auth.email, auth.password);
        app.then((e)=>{
            console.log("dd",e);
            Main.facebookAuth.getPerson(nightmare);
        })
        //Main.facebookAuth.goToPage(nightmare, 100009374775830);
    }
}
const main = new Main();