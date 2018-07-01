import FacebookAuth from "./modules/FacebookAuth/FacebookAuth";
import * as Nightmare from 'nightmare';

export default class Main {
    static facebookAuth = new FacebookAuth();
    constructor() {
      console.log('Typescript starter launched');
      
        const nightmare1 = new Nightmare({show:true});
        
        const app = Main.facebookAuth.authPage(nightmare1, "", "");
    }
}
const main = new Main();