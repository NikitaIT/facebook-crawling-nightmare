//import {Promise} from 'bluebird';
import * as Nightmare from 'nightmare';
//import { Logger } from 'log4js';
//import { log4js } from '../../utils/logger';
import { Person } from '../../models/Entity/Person';
import { Album } from '../../models/Entity/Album';
import { Comment } from '../../models/Entity/Comment';
import { Contact as ContactDTO } from '../../models/Entity/Contact';
import { Group } from '../../models/Entity/Group';
import { Photo } from '../../models/Entity/Photo';
import { PhotoTag } from '../../models/Entity/PhotoTag';
import { Post } from '../../models/Entity/Post';
import { Relative } from '../../models/Entity/Relative';
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
//#pagelet_timeline_medley_friends [data-testid="friend_list_item"] img
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
		const gotoProfilePage =  (nightmare: Nightmare) => ( id: string ) => nightmare.goto(`https://www.facebook.com/${id}`)
		const profile = gotoProfilePage(nightmare)("gunergoc");//profile.php?id=100009374775830
		const gotoPageFor = (profile: Nightmare) => (page: MainNav) =>	profile.click(`a[data-tab-key*="${page}"]`);
		const aboutPage =  gotoPageFor(profile)(MainNav.About);

		const gotoTabOn = (page: Nightmare) => ( selector:AboutTabs ) => page
			.wait(`li[title*="${selector}"]`)
			.click(`li[title*="${selector}"] a`);
			
		const gotoTabOnAboutPage = gotoTabOn(aboutPage);
		let chain = Promise.resolve(()=> Promise.resolve()) as any;
		
		let results:any[] = [];

		const LifeEvents  = () : Promise<LifeEvents> => {
			return gotoTabOnAboutPage(AboutTabs.LifeEvents)
				.wait('.fbProfileEditExperiences')
				.evaluate(()=> {
					const lifeEvents = document.querySelectorAll<HTMLSpanElement>('.fbProfileEditExperiences a span');
					return Array
					.from(lifeEvents)
					.map((x: HTMLSpanElement)=> {
						return x.innerText;
					});
				})
				.then((lifeEvents: string[])=>{
					lifeEvents.map(console.log);
					const ss: LifeEvents = {
						Birthdate: new Date(findEndSubstring(lifeEvents,LifeEventsTypes.Birthdate)),
						School: findEndSubstring(lifeEvents,LifeEventsTypes.School),
						Graduated: findEndSubstring(lifeEvents,LifeEventsTypes.Graduated),
						Married: lifeEvents.find(x => x == LifeEventsTypes.Married) == LifeEventsTypes.Married,
						TraveledTo: findEndSubstring(lifeEvents,LifeEventsTypes.TraveledTo),
						WorkedAt: findEndSubstring(lifeEvents,LifeEventsTypes.WorkedAt),
						MovedTo: findEndSubstring(lifeEvents,LifeEventsTypes.MovedTo)
					};
					console.log(ss);
					return (ss);
				});
		};
			
		const ContactandBasicInfo = () : Promise<ContactandBasicInfo> => {
			return gotoTabOnAboutPage(AboutTabs.ContactandBasicInfo)
				.wait('#pagelet_contact')
				.evaluate(()=>{
					const pagelets = {
						contact: "#pagelet_contact",
						basic: "#pagelet_basic"
					}
					const section = ".uiList.fbProfileEditExperiences";
					const rows = document.querySelectorAll<HTMLSpanElement>(section + " li");
					return Array
					.from(rows)
					.map((x: HTMLSpanElement)=> {
						return x.innerText;
					});
				})
				.then((rows: string[])=>{
					rows.map(console.log);
					const ss: ContactandBasicInfo = {
						BirthDate: new Date(findEndSubstring(rows, "Birthday")),
						BirthYear: new Date(findEndSubstring(rows, "Birthday")).getFullYear(),
						NameDay: new Date(findEndSubstring(rows, "Name Day")),
						Gender: findEndSubstring(rows, "Gender") as Gender,
						InterestedIn: findEndSubstring(rows, "Interested In") as InterestedIn,
						Languages: findEndSubstring(rows, "Languages").split(","),
						ReligiousViews: {ReligiousViews: findEndSubstring(rows, "Religious Views"), Description: "Text" as any as Text},
						PoliticalViews: {PoliticalViews: findEndSubstring(rows, "Political Views"), Description: "Text" as any as Text},
						MobilePhones : findEndSubstring(rows, "Mobile Phones"),
						Address: {
							Address: findEndSubstring(rows, "Address"),
							CityOrTown: findEndSubstring(rows, "City/Town"), //Saint Petersburg, Russia
							Zip: findEndSubstring(rows, "Zip")
						},
						Neighborhood: findEndSubstring(rows, "Neighborhood"),
						Email: findEndSubstring(rows, "Email"),
						Phones: [{
							type: "Home",
							value: "string"
						}]
					}
					return (ss);
				});
			};
			const sss = [LifeEvents,ContactandBasicInfo, ()=>"end"];
			sss.map((e: () => Promise<any>)=> {
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
		return {} as any;
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
							.wait('#userNavigationLabel')
							.cookies.get()
							.then((cookies : [Nightmare.ICookie]) => {
								if (cookies) {
									resolve(cookies.slice());
								}
							})
							.catch((e : any) => {
								nightmare.end().then(console.log);
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
