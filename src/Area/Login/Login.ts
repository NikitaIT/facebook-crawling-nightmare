import * as moment from 'moment';
import * as Nightmare from 'nightmare';
const config = {
    LoginForm:{
        url:'https://www.facebook.com/login/',
        email: '#email',
        password: '#pass',
        button: '#loginbutton',
        waitAfterLogin:{
            selector: '#userNavigationLabel',
            timeout: 10000
        }
    },
    Language:{
        script: `require("IntlUtils").setLocale(null, "www_card_selector_more", "en_US");`
    }
}
const loginToAccaunt = ( nightmare: Nightmare, email: string, password: string ) => (): Promise<Nightmare.ICookie[]> =>
new Promise((resolve, reject) => {
    nightmare.goto(config.LoginForm.url)
        .evaluate((config) => {
            const checker = document.querySelector(config.LoginForm.email);
            return !!checker;
        },config)
        .then((result) => {
            if (result) {
                nightmare.insert(config.LoginForm.email, email)
                    .insert(config.LoginForm.password, password)
                    .click(config.LoginForm.button)
                    .wait(config.LoginForm.waitAfterLogin.selector, config.LoginForm.waitAfterLogin.timeout)
                    .cookies.get()
                    .then((cookies : [Nightmare.ICookie]) => {
                        nightmare
                            .wait(2000)
                            .evaluate((config)=>{
                                /**
                                 * https://github.com/shivamgoswami757/Facebook-Phishing-Page/blob/master/desktop_files/desktop_files/VRRdhgO5aYh.js.download
                                 * 
                                 * www_card_selector_more не играет роли в выставлении языка(скорее всего он чтобы трэкать источник)
                                 */
                                const setAccauntLocaleUnsafe = () => {
                                    eval(config.Language.script);
                                    // можно сделать это по другому
                                    //eval(`intl_set_locale(null, "www_card_selector", "en_US");`);
                                }
                                setAccauntLocaleUnsafe();
                            },config)
                            .wait(2000)
                            .then(()=>{
                                moment.locale('en-US');
                                if (cookies) {
                                    resolve(cookies.slice());
                                }
                            })
                            .catch((e : any) => {
                                nightmare.end().then();
                                //logger.error('Ошибка при входе на страницу: ', e);
                                reject(e);
                            });
                    })
                    .catch((e : any) => {
                        nightmare.end().then();
                        //logger.error('Ошибка при входе на страницу: ', e);
                        reject(e);
                    });
            } else {
                resolve([]);
            }
        })
        .catch((e) => {
            nightmare.end().then();
            //logger.error('Ошибка аутентификации пользователя в сети facebook: ', e);
        
            reject(e);
        });
});


export const Login = loginToAccaunt