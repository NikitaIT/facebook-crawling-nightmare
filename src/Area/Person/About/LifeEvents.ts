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