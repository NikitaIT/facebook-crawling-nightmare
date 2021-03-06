import * as Nightmare  from "nightmare";
import { TNightmareResponse, clickSafe } from "../utils/Nightmare";

export enum MainNav{
	Timeline = "timeline",
	About = "about",
	Friends = "friends",
	Photos = "photos",
	More = "", //wtf last-child
}
/**
 * Могут быть кастомные пункты
 * Instagram= "124024574287414"
 */
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
	Notes= "notes"
}

const NavSelector = "a[data-tab-key*='{0}']";
export const gotoPageFor = (profile: Nightmare): TGotoPageForProfile => async (pageTab: MainNav): TNightmareResponse => {
	return clickSafe(profile)(NavSelector.replace('{0}',pageTab));
};

export type TGotoPageForProfile = (menuItem: MainNav) => TNightmareResponse;