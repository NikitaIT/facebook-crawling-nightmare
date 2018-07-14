import * as Nightmare  from "nightmare";

export enum MainNav{
	Timeline = "timeline",
	About = "about",
	Friends = "friends",
	Photos = "photos",
	More = "", //wtf last-child
}
export enum SubNav{
	Videos= "videos",
	CheckIns= "map",
	Sports= "sports",
	Music= "music",
	Movies= "movies",
	TVShows= "tv",
	Books= "books",
	AppsandGames = "games",
	Likes= "likes",
	Events= "events",
	Questions= "did_you_know",
	Reviews= "reviews",
	Notes= "notes",
	Instagram= "124024574287414" //wtf last-child
}
const NavSelector = "a[data-tab-key*='{0}']";
export const gotoPageFor = (profile: Nightmare) => (page: MainNav) => profile.click(`a[data-tab-key*="${page}"]`);
export type TGotoPageForProfile = (menuItem: MainNav) => Nightmare;