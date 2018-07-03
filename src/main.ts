import Facebook from "./modules/Facebook/Facebook";
import * as Nightmare from 'nightmare';

export default class Main {
    static facebookAuth = new Facebook();
    constructor() {
      console.log('Typescript Main launched');
      //https://www.facebook.com/100009374775830
        const nightmare = new Nightmare({show:true});
        //Main.facebookAuth.test(nightmare);
        const app = Main.facebookAuth.authPage(nightmare, "nikita2008-101@yandex.ru", "x121221X121221");
        app.then((e)=>{
            console.log("dd",e);
            Main.facebookAuth.getPerson(nightmare);

        })
        //Main.facebookAuth.goToPage(nightmare, 100009374775830);
    }
}
const main = new Main();