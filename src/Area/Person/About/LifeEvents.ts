import { AboutTabs, gotoTabOn } from './AboutTabs';
import { MainNav, TGotoPageForProfile } from '../../Nav';
import { findEndSubstring } from '../../../utils/utils';
export type LifeEvents = {
	Birthdate: Date,
	School: string,
	Graduated: string,
	Married: boolean,
	TraveledTo: string,
	WorkedAt: string,
	MovedTo: string
}
export enum LifeEventsTypes{			
	Birthdate = "Born on ",
	School = "Went to School at ",
	Graduated = "Graduated from ",
	Married = "Got Married",
	TraveledTo = "Traveled to ",
	WorkedAt = "Worked at ",
	MovedTo = "Moved to " 
}
export const LifeEvents  = (gotoPageForProfile: TGotoPageForProfile ) => () : Promise<LifeEvents> => {
	return gotoTabOn(gotoPageForProfile(MainNav.About))(AboutTabs.LifeEvents)
		.wait('.fbProfileEditExperiences')
		.evaluate(()=> {
			const lifeEvents = document.querySelectorAll<HTMLSpanElement>('.fbProfileEditExperiences a span');
			return Array
			.from(lifeEvents)
			.map((x: HTMLSpanElement)=> {
				return x.innerText;
			});
		})
		.then((lifeEventsStrings: string[])=>{
			const lifeEvents: LifeEvents = {
				Birthdate: new Date(findEndSubstring(lifeEventsStrings,LifeEventsTypes.Birthdate)),
				School: findEndSubstring(lifeEventsStrings,LifeEventsTypes.School),
				Graduated: findEndSubstring(lifeEventsStrings,LifeEventsTypes.Graduated),
				Married: lifeEventsStrings.find(x => x == LifeEventsTypes.Married) == LifeEventsTypes.Married,
				TraveledTo: findEndSubstring(lifeEventsStrings,LifeEventsTypes.TraveledTo),
				WorkedAt: findEndSubstring(lifeEventsStrings,LifeEventsTypes.WorkedAt),
				MovedTo: findEndSubstring(lifeEventsStrings,LifeEventsTypes.MovedTo)
			};
			return lifeEvents;
		});
};