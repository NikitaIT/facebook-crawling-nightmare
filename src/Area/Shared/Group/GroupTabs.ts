import * as Nightmare  from "nightmare";
/**
 * Так же на страницах могут быть табы вида tab_custom_168188869963563
 * Они берутся от сюда, вот например инста https://apps.facebook.com/instatab
 */
export enum EGroupTabs {
    About = "about",
    Discussion = "discussion",
    Announcements = "announcements",
    Members = "members",
    Events = "events",
    Videos = "videos",
    Photos = "photos",
    Files = "files",
    Recommendations = "recommendations"
}
export enum EPageTabs {
    Home = "home",
    Posts = "posts",
    Videos = "videos",
    Photos = "photos",
    About = "about",
    Community = "community",
    Groups = "groups",
    Services = "services",
    Events = "events",
    InfoAndAds= "ads",
}
export const contentSelector = "#content_container";

const getPageTabSelector = (selector: EPageTabs) => "tab_" + selector;

const gotoLinkTabOn = async (page: Nightmare, selector:string ) => {
    const tab = `[data-key="${selector}"] a`;
    return (await page.wait(2000).exists(tab).then<boolean>(_ => _)) 
        && page.click(tab).wait(2000).exists(tab).then<boolean>(_ => _);
};

export const gotoGroupTabOn = (page: Nightmare) => ( selector:EGroupTabs ) => gotoLinkTabOn(page, selector == EGroupTabs.Discussion?"":selector);
export const gotoPageTabOn = (page: Nightmare) => ( selector:EPageTabs ) => gotoLinkTabOn(page, getPageTabSelector(selector));
