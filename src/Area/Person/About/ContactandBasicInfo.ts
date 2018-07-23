import { AboutTabs, gotoTabOn } from './AboutTabs';
import { MainNav, TGotoPageForProfile } from '../../Nav';
import { findEndSubstring } from '../../../utils/utils';
import { configContactandBasicInfo } from './about.config';
type Gender = "Mail"|"Female"|"Custom";
export type InterestedIn = "Women"| "Men";

export type TContact = {
	MobilePhones : string
	Address:{
		Address: string
		CityOrTown: string //Saint Petersburg, Russia
		Zip: string
	}
	Neighborhood: string
	Email: string
	Phones: {
		type: "Home"|"Work" 
		value: string
	}[]
}

export type TBasicInfo = {
	BirthDate: Date
	BirthYear: number
	NameDay: Date
	Gender: Gender
	InterestedIn: InterestedIn
	Languages: string[]
	ReligiousViews: {ReligiousViews: string, Description: Text}
	PoliticalViews: {PoliticalViews: string, Description: Text}
}

export type TContactandBasicInfo = TContact & TBasicInfo

export const ContactandBasicInfo = ( gotoPageForProfile: TGotoPageForProfile) => ()  : Promise<TContactandBasicInfo> => {
	const config = configContactandBasicInfo;
	return gotoTabOn(gotoPageForProfile(MainNav.About))(AboutTabs.ContactandBasicInfo)
		.wait('#pagelet_contact')
		.evaluate((config)=>{
			const rows = document.querySelectorAll<HTMLSpanElement>(config.sectionrows);
			return Array
			.from(rows)
			.map((x: HTMLSpanElement)=> {
				return x.innerText;
			});
		},config)
		.then((rows: string[])=>{
			const 
			contactandBasicInfo: TContactandBasicInfo = {
				BirthDate: new Date(findEndSubstring(rows, config.BirthDate)),
				BirthYear: new Date(findEndSubstring(rows, config.BirthYear)).getFullYear(),
				NameDay: new Date(findEndSubstring(rows, config.NameDay)),
				Gender: findEndSubstring(rows, config.Gender) as Gender,
				InterestedIn: findEndSubstring(rows, config.InterestedIn) as InterestedIn,
				Languages: findEndSubstring(rows, config.Languages.endWith).split(config.Languages.split),
				ReligiousViews: {ReligiousViews: findEndSubstring(rows, config.ReligiousViews.ReligiousViews), Description: "Text" as any as Text},
				PoliticalViews: {PoliticalViews: findEndSubstring(rows, config.PoliticalViews.PoliticalViews), Description: "Text" as any as Text},
				MobilePhones : findEndSubstring(rows, config.MobilePhones),
				Address: {
					Address: findEndSubstring(rows, config.Address.Address),
					CityOrTown: findEndSubstring(rows, config.Address.CityOrTown), //Saint Petersburg, Russia
					Zip: findEndSubstring(rows, config.Address.Zip)
				},
				Neighborhood: findEndSubstring(rows, config.Neighborhood),
				Email: findEndSubstring(rows, config.Email),
				Phones: [{
					type: "Home",
					value: "string"
				}]
			}
			return contactandBasicInfo;
		});
	};
	