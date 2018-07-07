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
import { gotoPageFor } from '../../models/ContentModel/Nav';
import { LifeEvents } from '../../models/ContentModel/AboutPage/LifeEvents';
import { Friends } from '../../models/ContentModel/FriendsPage/Friends';
import { ContactandBasicInfo } from '../../models/ContentModel/AboutPage/ContactandBasicInfo';
import * as Nightmare from 'nightmare';
import { PostPages } from '../../models/ContentModel/RootPage/Posts';

type Person1 = {
    id:string,
    extraData:Text,
    screenName:string,
    firstName:string,
    lastName:string,
    middleName:string,
    maidenName:string,
    name:string,
    //birthdate:Date,
    country:Text,
    region:Text,
    city:Text,
    gender:string,
    position:string,
    phone:string,
    phoneHome:string,
    deleted:boolean,
    lastSeenDate:Date,
    lastUpdateDate:Date,
    dateUpdated:Date,
    platform:string,
    registeredDate:Date,
    homePage:string,
    homePageName:string,
    description:string,
    verified:boolean,
    status:string,
    url:string,
    postCount:number,
    favoritesCount:number,
    friendsCount:number,
    followersCount:number,
    groupMembersCount:number,
    address:string,
    location:Text,
    premium:boolean,
    private_:boolean,
    statusDate:Date,
    photo:string,
    photoSmall:string,
    photoMedium:string,
    photoLarge:string,
    email:string,
    relationship:string
}



enum Search{
	Name ="#fb-timeline-cover-name"
}

//const logger: Logger = log4js.getLogger("Facebook");
interface IFacebook{
	goToPage(nightmare : Nightmare, 
		id: string | number, 
		conf?: {
			rootUrl: string,
			profileRoute: string
		}): void,
	getUserIdByPage(
			nightmare : Nightmare, 
			conf?: {
				profileId: string
			}
		): Promise<number>,
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}>,
	getPerson(nightmare : Nightmare) : Promise<Person>
	getAlbum(nightmare : Nightmare) : Promise<Album>
	getComment(nightmare : Nightmare) : Promise<Comment>
	getContact(nightmare : Nightmare) : Promise<Contact>
	getGroup(nightmare : Nightmare) : Promise<Group>
	getPhoto(nightmare : Nightmare) : Promise<Photo>
	getPhotoTag(nightmare : Nightmare) : Promise<PhotoTag>
	getPost(nightmare : Nightmare) : Promise<Post>
	getRelative(nightmare : Nightmare) : Promise<Relative>
}
export default class Facebook implements IFacebook {
	getPerson(nightmare: Nightmare): Promise<Person> {
		const gotoProfilePage =  (nightmare: Nightmare) => ( id: string ) => nightmare.goto(`https://www.facebook.com/${id}`).wait('#fbTimelineHeadline')
		const profile = gotoProfilePage(nightmare)("raja.sirhatti.52");//profile.php?id=100009374775830 //https://www.facebook.com/huan.lu.5099
		const gotoPageForProfile =  gotoPageFor(profile);

		let chain = Promise.resolve(()=> Promise.resolve()) as any;
		
		let results:any[] = [];
		//LifeEvents,ContactandBasicInfo,
		const actions = [PostPages, (_: any) => ()=>"end"];
			actions
			.map((x: (_: any) => any) => x(gotoPageForProfile))
			.map((e: () => Promise<any>)=> {
				chain = chain.then((past: () => Promise<any>)=>{
					return past().then((data: any)=>{
						results.push(data);
						return ()=>e();
					});
				});
			});
			console.info("sss");
			chain
			.then((data: any)=>{
				results.push(data);
				console.log("results");
				console.log(results);
			})
			.catch((e: any)=>{
				console.log("catch",e);
				nightmare.end().then(console.log);
				
				//logger.error('Ошибка xx: ', e);
			});
		throw new Error("Method not implemented.");
	}
	getAlbum(nightmare: Nightmare): Promise<Album> {
		throw new Error("Method not implemented.");
	}
	getComment(nightmare: Nightmare): Promise<Comment> {
		throw new Error("Method not implemented.");
	}
	getContact(nightmare: Nightmare): Promise<Contact> {
		throw new Error("Method not implemented.");
	}
	getGroup(nightmare: Nightmare): Promise<Group> {
		throw new Error("Method not implemented.");
	}
	getPhoto(nightmare: Nightmare): Promise<Photo> {
		throw new Error("Method not implemented.");
	}
	getPhotoTag(nightmare: Nightmare): Promise<PhotoTag> {
		throw new Error("Method not implemented.");
	}
	getPost(nightmare: Nightmare): Promise<Post> {
		throw new Error("Method not implemented.");
	}
	getRelative(nightmare: Nightmare): Promise<Relative> {
		throw new Error("Method not implemented.");
	}
	goToPage(
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

	getUserIdByPage(
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
	
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}> {
		return new Promise((resolve, reject) => {
			console.log("e");
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
							.wait(10000)//'#userNavigationLabel',
							.cookies.get()
							.then((cookies : [Nightmare.ICookie]) => {
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
}
