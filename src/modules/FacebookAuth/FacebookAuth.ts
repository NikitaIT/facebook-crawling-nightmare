import {Promise} from 'bluebird';
import * as Nightmare from 'nightmare';
import { Logger } from 'log4js';
import { log4js } from '../../utils/logger';


const logger: Logger = log4js.getLogger("FacebookAuth");

export default class FacebookAuth {
	authPage(nightmare : Nightmare, email: string, password: string) {
		return new Promise((resolve, reject) => {
			console.log("e");
			nightmare.goto('https://www.facebook.com/')
				.evaluate(() => {
					console.log("evaluate");
					const checker = document.querySelector('#email');
					return !!checker;
				})
				.then((result) => {
					console.log("result");
					if (result) {
						nightmare.insert('#email', email)
							.insert('#pass', password)
							.click('#loginbutton')
							.wait('#userNavigationLabel')
							.cookies.get()
							.then((cookies : [Nightmare.ICookie]) => {
								if (cookies) {
									resolve(cookies.slice());
								}
							})
							.catch((e : any) => {
								nightmare.end().then(console.log);
								logger.error('Ошибка при входе на страницу: ', e);
								reject(e);
							});
					} else {
						resolve([]);
					}
				})
				.catch((e) => {
					console.log("catch");
					console.log(e);
					
					nightmare.end().then(console.log);
					logger.error('Ошибка аутентификации пользователя в сети facebook: ', e);
				
					reject(e);
				});
		});
	}
}
