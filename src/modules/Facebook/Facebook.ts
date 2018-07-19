//import {Promise} from 'bluebird';
//import { Logger } from 'log4js';
//import { log4js } from '../../utils/logger';
import { Person } from '../../models/Entity/Person';
import { Album } from '../../models/Entity/Album';
import { Comment } from '../../models/Entity/Comment';
import { Contact as ContactDTO, Contact } from '../../models/Entity/Contact';
import { Group } from '../../models/Entity/Group';
import { Photo } from '../../models/Entity/Photo';
import { PhotoTag } from '../../models/Entity/PhotoTag';
import { Post } from '../../models/Entity/Post';
import { Relative } from '../../models/Entity/Relative';
import * as Nightmare from 'nightmare';
import { chainPromiseFn } from '../../utils/utils';
import { MainNav, gotoPageFor } from '../../Area/Nav';
import { ContactandBasicInfo } from '../../Area/Person/About/ContactandBasicInfo';
import { LifeEvents } from '../../Area/Person/About/LifeEvents';
import { PhotosPages, TAlbum, TPhotoPage } from '../../Area/Person/Photos/Photos';
import { EPhotosTabs } from '../../Area/Person/Photos/PhotosTabs';
import { TPostPage, PostPages } from '../../Area/Person/Posts/Posts';
import * as moment from 'moment';

enum Search{
	Name ="#fb-timeline-cover-name"
}

//const logger: Logger = log4js.getLogger("Facebook");
interface IFacebook{
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}>,
	getPerson(nightmare : Nightmare) : Promise<Person>
	getAlbum(nightmare : Nightmare) : Promise<Album[]>
	getComment(nightmare : Nightmare) : Promise<Comment[]>
	getContact(nightmare : Nightmare) : Promise<Contact>
	getGroup(nightmare : Nightmare) : Promise<Group[]>
	getPhoto(nightmare : Nightmare) : Promise<Photo[]>
	getPhotoTag(nightmare : Nightmare) : Promise<PhotoTag>
	getPost(nightmare : Nightmare) : Promise<Post[]>
	getRelative(nightmare : Nightmare) : Promise<Relative>
}
export default class Facebook implements IFacebook {
	profile: () => Nightmare;
	id: string;
	numberId: number;
	private gotoProfilePage =  (nightmare: Nightmare) => ( id: string ) => nightmare.goto(`https://www.facebook.com/${id}`).wait('#fbTimelineHeadline');
	private gotoPageForProfile: () => (page: MainNav) => Nightmare;
	public constructor(nightmare: Nightmare, id: string = "halit.eraslan.731", numberId: number= 100025424408094){
		this.id = id;
		this.profile = () => this.gotoProfilePage(nightmare)(id);//profile.php?id=100009374775830 //https://www.facebook.com/huan.lu.5099 //raja.sirhatti.52
		this.gotoPageForProfile =  () => gotoPageFor(this.profile());
	}
	getPerson(nightmare: Nightmare): Promise<Person> {
		return chainPromiseFn([LifeEvents,ContactandBasicInfo].map((x: (_: any) => any) => x(this.gotoPageForProfile())));
	}
	getAlbum(nightmare: Nightmare): Promise<Album[]> {
		return PhotosPages(this.gotoPageForProfile())(EPhotosTabs.Albums)().then<Album[]>( (y: any) => {
			return (y as TAlbum[]).map( (x: any) => {
				return {
					...x
				} as Album;
			});
		});
	}
	getComment(nightmare: Nightmare): Promise<Comment[]> {
		throw new Error("Method not implemented.");
	}
	getContact(nightmare: Nightmare): Promise<Contact> {
		throw new Error("Method not implemented.");
	}
	getGroup(nightmare: Nightmare): Promise<Group[]> {
		throw new Error("Method not implemented.");
	}
	getPhoto(nightmare: Nightmare): Promise<Photo[]> {
		return PhotosPages(this.gotoPageForProfile())(EPhotosTabs.PhotosOf)().then<Photo[]>( (y: any) => {
			return (y as TPhotoPage[]).map( (x: any) => {
				return {
					...x
				} as Photo;
			});
		});
	}
	getPhotoTag(nightmare: Nightmare): Promise<PhotoTag> {
		throw new Error("Method not implemented.");
	}
	getPost(nightmare: Nightmare): Promise<Post[]> {
		return PostPages(this.gotoPageForProfile(), this.numberId)().then( (y: any) => {
			return (y as TPostPage[]).map( (x: any) => {
				return {
					...x
				} as Post;
			});
		});
	}
	getRelative(nightmare: Nightmare): Promise<Relative> {
		throw new Error("Method not implemented.");
	}
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}> {
		return new Promise((resolve, reject) => {
			nightmare.goto('https://www.facebook.com/login/')
				.evaluate(() => {
					const checker = document.querySelector('#email');
					return !!checker;
				})
				.then((result) => {
					if (result) {
						nightmare.insert('#email', email)
							.insert('#pass', password)
							.click('#loginbutton')
							.wait('#userNavigationLabel', 10000)
							.cookies.get()
							.then((cookies : [Nightmare.ICookie]) => {
								nightmare
									.wait(2000)
									.evaluate(()=>{
										/**
										 * https://github.com/shivamgoswami757/Facebook-Phishing-Page/blob/master/desktop_files/desktop_files/VRRdhgO5aYh.js.download
										 * 
										 * www_card_selector_more не играет роли в выставлении языка(скорее всего он чтобы трэкать источник)
										 */
										const setAccauntLocaleUnsafe = () => {
											eval(`require("IntlUtils").setLocale(null, "www_card_selector_more", "en_US");`);
											// можно сделать это по другому
											//eval(`intl_set_locale(null, "www_card_selector", "en_US");`);
										}
										setAccauntLocaleUnsafe();
									})
									.wait(2000)
									.then(()=>{
										moment.locale('en-US');
										if (cookies) {
											resolve(cookies.slice());
										}
									})
									.catch((e : any) => {
										nightmare.end().then(console.log);
										console.log(e);
										//logger.error('Ошибка при входе на страницу: ', e);
										reject(e);
									});
							})
							.catch((e : any) => {
								nightmare.end().then(console.log);
								console.log(e);
								//logger.error('Ошибка при входе на страницу: ', e);
								reject(e);
							});
					} else {
						resolve([]);
					}
				})
				.catch((e) => {
					console.log(e);
					nightmare.end().then(console.log);
					//logger.error('Ошибка аутентификации пользователя в сети facebook: ', e);
				
					reject(e);
				});
		});
	}

	private goToPage(
		nightmare : Nightmare, 
		id: string | number, 
		conf?: {
			rootUrl: string,
			profileRoute: string
		}
	) {
		let config = {
			rootUrl: 'https://www.facebook.com/',
			profileRoute: 'profile.php',
			...conf
		}
		let queryUrl = config.rootUrl;
		switch (typeof(id)) {
			case 'string':
				queryUrl += id;
				break;
			case 'number':
				queryUrl += config.profileRoute + '?id=' + id;
				break;
			default:
				throw new TypeError(`Тип аргумента: ${typeof(id)}. Требуется string или number.`)
		}
		console.log("queryUrl:",queryUrl);
		nightmare.goto(queryUrl);
	}

	private getUserIdByPage(
		nightmare : Nightmare, 
		conf?: {
			profileId: string
		}
	): Promise<number> {
		let config = {
			profileId: 'referrer_profile_id',
			...conf
		}
		const selector = `[href*="${config.profileId}"]`;
		return nightmare
			.wait(selector)
			.then((result)=> {
				const href = (document.querySelector(selector) as HTMLLinkElement).href;
				return parseInt(href.split(`${config.profileId}=`).pop(), 10);
			});
	}
}
