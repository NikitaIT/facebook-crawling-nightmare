import { AboutTabs, gotoTabOn } from './AboutTabs';
import { MainNav, TGotoPageForProfile } from '../Nav';
import { findEndSubstring } from '../../../utils/utils';
type Gender = "Mail"|"Female"|"Custom";
export type InterestedIn = "Women"| "Men";

export type Contact = {
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

export type BasicInfo = {
	BirthDate: Date
	BirthYear: number
	NameDay: Date
	Gender: Gender
	InterestedIn: InterestedIn
	Languages: string[]
	ReligiousViews: {ReligiousViews: string, Description: Text}
	PoliticalViews: {PoliticalViews: string, Description: Text}
}

export type ContactandBasicInfo = Contact & BasicInfo

export const ContactandBasicInfo = ( gotoPageForProfile: TGotoPageForProfile) => ()  : Promise<ContactandBasicInfo> => {
	return gotoTabOn(gotoPageForProfile(MainNav.About))(AboutTabs.ContactandBasicInfo)
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
	