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
import { TContactandBasicInfo, ContactandBasicInfo } from '../../Area/Person/About/ContactandBasicInfo';
import { TLifeEvents, LifeEvents } from '../../Area/Person/About/LifeEvents';
import { PhotosPages, TAlbumPage, TPhotoPage } from '../../Area/Person/Photos/Photos';
import { EPhotosTabs } from '../../Area/Person/Photos/PhotosTabs';
import { TPostPage, PostPages } from '../../Area/Person/Posts/Posts';
import { Login } from '../../Area/Login/Login';
import { Automapper } from '../../infrastructure/Automapper';
import { goToPage } from '../../utils/Facebook';
import { Groups, GroupMembers } from '../../Area/Group/Group';
import { PageType } from '../../Area/PageTypes';
import { Friends } from '../../Area/Person/Friends/Friends';


enum Search{
	Name ="#fb-timeline-cover-name"
}

//const logger: Logger = log4js.getLogger("Facebook");
interface IFacebook{
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}>,
	getPerson(nightmare : Nightmare) : Promise<Person>
	getFriends(nightmare : Nightmare) : Promise<Person[]>
	getAlbum(nightmare : Nightmare) : Promise<Album[]>
	getComment(nightmare : Nightmare) : Promise<Comment[]>
	getContact(nightmare : Nightmare) : Promise<Contact>
	getGroup(nightmare : Nightmare,id: string) : Promise<Group>
	getGroupMembers(nightmare : Nightmare,id: string) : Promise<Person[]>
	getPhoto(nightmare : Nightmare) : Promise<Photo[]>
	getPhotoTag(nightmare : Nightmare) : Promise<PhotoTag>
	getPost(nightmare : Nightmare) : Promise<Post[]>
	getRelative(nightmare : Nightmare) : Promise<Relative>
}
export default class Facebook implements IFacebook {

	profile: () => Nightmare;
	private gotoProfilePage =  (nightmare: Nightmare) => ( id: string|number ) => goToPage(nightmare, id).wait('#fbTimelineHeadline');
	private gotoPageForProfile = () => gotoPageFor(this.profile());
	public constructor(nightmare: Nightmare, id: string|number){
		this.profile = () => this.gotoProfilePage(nightmare)(id);
	}
	getPerson(nightmare: Nightmare): Promise<Person> {
		return (async ()=>
			Automapper.smartAssign(
				Automapper.mapToPerson.FromTLifeEvents( await LifeEvents(this.gotoPageForProfile())()),
				Automapper.mapToPerson.FromTContactandBasicInfo( await ContactandBasicInfo(this.gotoPageForProfile())()),
			)
		)();
	}
	getAlbum(nightmare: Nightmare): Promise<Album[]> {
		return PhotosPages(this.gotoPageForProfile())
		(EPhotosTabs.Albums)
		<TAlbumPage>()
		.then( y => y.map<Album>( Automapper.mapToAlbum.FromTAlbumPage ));
	}
	getFriends(nightmare: Nightmare): Promise<Person[]> {
		return Friends(this.gotoPageForProfile())()
			.then(y => y.friends.map(Automapper.mapToPerson.FromTFriend));
	}
	getComment(nightmare: Nightmare): Promise<Comment[]> {
		throw new Error("Method not implemented.");
	}
	getContact(nightmare: Nightmare): Promise<Contact> {
		throw new Error("Method not implemented.");
	}
	getGroup(nightmare: Nightmare,id: string): Promise<Group> {
		return Groups(goToPage(nightmare, id, PageType.Group))();
	}
	getCommunityOrPublicFigure(nightmare: Nightmare,id: string): Promise<Group> {
		return CommunityOrPublicFigure(goToPage(nightmare, id, PageType.CommunityOrPublicFigure))();
	}
	getPhoto(nightmare: Nightmare): Promise<Photo[]> {
		return PhotosPages(this.gotoPageForProfile())
				(EPhotosTabs.PhotosOf)
				<TPhotoPage>()
				.then( y => y.map<Photo>( Automapper.mapToPhoto.FromTPhotoPage ));
	}
	getPhotoTag(nightmare: Nightmare): Promise<PhotoTag> {
		throw new Error("Method not implemented.");
	}
	getPost(nightmare: Nightmare): Promise<Post[]> {
		return PostPages(this.gotoPageForProfile())()
				.then( y => y.map( Automapper.mapToPost.FromTPostPage ));
	}
	getRelative(nightmare: Nightmare): Promise<Relative> {
		throw new Error("Method not implemented.");
	}	
	getGroupMembers(nightmare: Nightmare, id: string): Promise<Person[]> {
		return GroupMembers(goToPage(nightmare, id, PageType.Group))
			.then(_ => _.Members.Members.Users);
	}
	authPage(nightmare : Nightmare, email: string, password: string): Promise<{}> {
		return Login(nightmare,email,password)();
	}
}
