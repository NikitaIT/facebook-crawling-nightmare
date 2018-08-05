import { AboutTabs, gotoTabOn } from './AboutTabs';
import { MainNav, TGotoPageForProfile } from '../../Nav';
import { findEndSubstring } from '../../../utils/utils';
export type TLifeEvents = {
	Birthdate: Date,
	School: string,
	Graduated: string,
	Married: boolean,
	TraveledTo: string,
	WorkedAt: string,
	MovedTo: string
}
export enum LifeEventsTypes {
	Birthdate = "Born on ",
	School = "Went to School at ",
	Graduated = "Graduated from ",
	Married = "Got Married",
	TraveledTo = "Traveled to ",
	WorkedAt = "Worked at ",
	MovedTo = "Moved to "
}
export const LifeEvents = (gotoPageForProfile: TGotoPageForProfile) => async (): Promise<TLifeEvents> => {	
	console.log("LifeEvents");

	const	responseAbout = await gotoPageForProfile(MainNav.About);
	const response = await gotoTabOn(responseAbout.nightmare)(AboutTabs.LifeEvents);

	return response.nightmare
		.wait('.fbProfileEditExperiences',2000)
		.evaluate(() => {
			const lifeEvents = document.querySelectorAll<HTMLSpanElement>('.fbProfileEditExperiences a span');
			return Array
				.from(lifeEvents)
				.map((x: HTMLSpanElement) => {
					return x.innerText;
				});
		})
		.then((lifeEventsStrings: string[]) => {
			const lifeEvents: TLifeEvents = {
				Birthdate: new Date(findEndSubstring(lifeEventsStrings, LifeEventsTypes.Birthdate)),
				School: findEndSubstring(lifeEventsStrings, LifeEventsTypes.School),
				Graduated: findEndSubstring(lifeEventsStrings, LifeEventsTypes.Graduated),
				Married: lifeEventsStrings.find(x => x == LifeEventsTypes.Married) == LifeEventsTypes.Married,
				TraveledTo: findEndSubstring(lifeEventsStrings, LifeEventsTypes.TraveledTo),
				WorkedAt: findEndSubstring(lifeEventsStrings, LifeEventsTypes.WorkedAt),
				MovedTo: findEndSubstring(lifeEventsStrings, LifeEventsTypes.MovedTo)
			};
			return lifeEvents;
		});
};