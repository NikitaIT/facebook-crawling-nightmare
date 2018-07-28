
import * as Nightmare  from "nightmare";
import { clickSafe } from "../../../utils/Nightmare";

export enum AboutTabs{
	Overview = "Overview",
	WorkandEducation = "Work and Education",
	PlacesLived = "Places She's Lived",
	ContactandBasicInfo = "Contact and Basic Info",
	FamilyandRelationships = "Family and Relationships",
	DetailsAboutDevlet = "Details About Devlet",
	LifeEvents = "Life Events",
}

export const gotoTabOn = (page: Nightmare) => ( selector:AboutTabs ) => clickSafe(page)(`li[title*="${selector}"] a`);