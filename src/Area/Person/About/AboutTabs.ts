
import * as Nightmare  from "nightmare";

export enum AboutTabs{
	Overview = "Overview",
	WorkandEducation = "Work and Education",
	PlacesLived = "Places She's Lived",
	ContactandBasicInfo = "Contact and Basic Info",
	FamilyandRelationships = "Family and Relationships",
	DetailsAboutDevlet = "Details About Devlet",
	LifeEvents = "Life Events",
}

export const gotoTabOn = (page: Nightmare) => ( selector:AboutTabs ) => page
				.wait(`li[title*="${selector}"]`)
				.click(`li[title*="${selector}"] a`);