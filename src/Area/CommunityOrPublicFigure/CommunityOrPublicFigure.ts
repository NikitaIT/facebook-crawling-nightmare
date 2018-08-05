import * as Nightmare from "nightmare";
import { Group } from "../../models/Entity/Group";
import { gotoPageTabOn, EPageTabs, EPageTabs } from "../Shared/Group/GroupTabs";

/**
 * Публичная страница https://www.facebook.com/pg/asdpecs/about/?ref=page_internal
 */
type TGroupAbout  = {
    FindUs: {
        Call: number,
        Mme: number
    },
    Hours: string,
    PageInfo: string,
    ContactInfo: string,
    MoreInfo: string,
    Story: string
}
const configGroupAbout = {
    selector: "#content_container",
    wait: `[id*="PagesProfileAboutInfoPagelet"]`,
    FindUs:{
        selector: `a[ajaxify*="/places/map/"]`,
        Call:{
            pattern: /Call ([\d|,|.|\s|\+|(|)]+)/.toString(),
            replace: /[,|.|\s|\+|(|)]/.toString()
        },
        Mme:{
            pattern:/m.me\/(\d+)/.toString()
        }
    },
    Hours: {
        pattern: /HOURS(.*)PAGE INFO/.toString(),

    },
    PageInfo:{
        pattern: /PAGE INFO(.*)CONTACT INFO/.toString()
    },
    ContactInfo:{
        pattern: /CONTACT INFO(.*)MORE INFO/.toString()
    },
    MoreInfo:{
        pattern: /MORE INFO(.*)/.toString(),
        About:{
            pattern: /About(.*)Community/.toString(),
        }
    },
    Story: {
        click: `[href*="/story/]`,
        wait: `button[title="Close Note"]`,
        pattern: /STORY(.*)/.toString(),
    }
}
const getGroupAbout = (config): TGroupAbout  => {
    const   
            textContent = 
                (_ => _ && _.textContent || "")
                (document.querySelector<HTMLElement>(config.selector)),
            findUsContent= 
                (_ => _ && _.textContent || "")
                (document.querySelector<HTMLElement>(config.selector+" "+config.FindUs.selector));
                
    return {
        FindUs: {
            Call: 
                ((_ : any) => (
                    _ = _ && _.replace(eval(config.FindUs.Call.replace), ""),
                    _ && parseInt(_)
                ))(textContent.match(eval(config.FindUs.Call.pattern))[1]),
            Mme: 
                ((_ : any) => (
                    _ && parseInt(_)
                ))(textContent.match(eval(config.FindUs.Mme.pattern))[1])
        },
        Hours: textContent.match(eval(config.Hours.pattern))[1],
        PageInfo: textContent.match(eval(config.PageInfo.pattern))[1],
        ContactInfo: textContent.match(eval(config.ContactInfo.pattern))[1],
        MoreInfo: textContent.match(eval(config.MoreInfo.pattern))[1],
        Story: textContent.match(eval(config.Story.pattern))[1]
    };
}

export const CommunityOrPublicFigure =  ( nightmare: any) => async ()  : Promise<Group> => {
    const about = await getDataOn(nightmare)(EPageTabs.About, getGroupAbout,configGroupAbout)();
    
    return {
        
    }
};
const getDataOn = 
    (groupPage: Nightmare) => 
    <TResult, TConfig>(tab: EPageTabs, evaluator: (config: TConfig) => TResult, config: TConfig, promiseDoSomething?: () => Promise<any>) => 
    async (): Promise<TResult> => 
{
    let tryIfDown = 10;
    while (tryIfDown) {
        try {
            if (await gotoPageTabOn(groupPage)(tab)) {
                console.debug("then Group start evaluator", tab);
                if (promiseDoSomething)
                    return await await promiseDoSomething().then(_ => groupPage.evaluate(evaluator, config).then<TResult>(_ => _));
                return await groupPage.evaluate(evaluator, config).then<TResult>(_ => _);
            } else {
                console.info("tab is undefind: ", tab);
            }
        } catch (error) {
            console.error(error);
            if ((error as Error).message == "navigation error" && tryIfDown) {
                console.info("try If Down:", tryIfDown--);
            }
        }
    }
};