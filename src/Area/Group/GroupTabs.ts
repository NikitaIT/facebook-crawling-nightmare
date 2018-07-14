import * as Nightmare  from "nightmare";
export enum EGroupTabs {
    About = "about",
    Discussion = "discussion",
    Members = "members",
    Events = "events",
    Videos = "videos",
    Photos = "photos"
}
export const gotoTabOn = (page: Nightmare) => ( selector:EGroupTabs ) => page
				.wait(`[data-key="${selector}"] a`)
                .click(`[data-key="${selector}"] a`)
				.wait(`[data-key="${selector}"] a`);