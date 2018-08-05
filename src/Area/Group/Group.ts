import * as Nightmare from "nightmare";
import { Group } from "../../models/Entity/Group";
import { findNumberRegexp, chainPromiseFn } from "../../utils/utils";
import { gotoGroupTabOn, EGroupTabs } from "../Shared/Group/GroupTabs";
import { scrollDown } from "../../utils/Nightmare";
import { Person } from "../../models/Entity/Person";
import { getGroupMembers } from "./Members";
import { getGroupDiscussion } from "./Discussion";
import { getGroupAbout } from "./About";
import { getGroupLayout } from "./Layout";
import { configGroupDiscussion, configGroupLayout, configGroupAbout, configGroupMembers } from "./group.config";
type TGroupContent = {
}
class EGroupSelectors {
    membersCount = {
        selector: 'a[href*="/members/"]',
        pattern: /(\d+) Members/
    };
    nav = {
        selector: '[data-key="{0}"] a'
    }
    all = {
        photo:"#headerArea img.photo", //src
    }
}
const config: EGroupSelectors = new EGroupSelectors();

class DataSelector{
    public static run =  ( groupPage: Nightmare ) => async ()  : Promise<Group> => {
        const   getData = getDataOn(groupPage),
                discussion = await getData(EGroupTabs.Discussion, getGroupDiscussion, configGroupDiscussion)(),
                layout = await getData(EGroupTabs.Discussion, getGroupLayout, configGroupLayout)(),
                about = await getData(
                    EGroupTabs.About, getGroupAbout, configGroupAbout, 
                    () => groupPage.click(configGroupAbout.AboutThisGroup.Description.clickSelector).then(_ => _)
                )(),
                members = await getData(EGroupTabs.Members, getGroupMembers, configGroupMembers)();
        return {
            //id:"string",
            //extraData:"",
            //name:"string",
            screenName: layout && layout.Layout.Nav.Title,
            //email:"string",
            //country:"",
            location: discussion && discussion.Location,
            //city:"" ,
            //address:"string",
            type: about && about.AboutThisGroup.GroupType,
            description: about && about.AboutThisGroup.Description,
            //phone:"string",
            private_: layout && layout.Layout.Nav.Privacy === "Private",
            //premium:true,
            //verified:true,
            //homePage:"string",
            //homePageName:"",
            membersCount: members && members.Members.Count || about && about.Members.Count,
            dateUpdated: about && about.Activity.CreatedAt,
            //dateLabel:"string",
            //photo:"string",//#headerArea img.photo
            //photoSmall:"string",
            //photoMedium:"string",
            //photoLarge:"string",
            admin: members && members.Members.AdminsAndModerators.Users[0].id,
            //deleted:true,
            //status:"string",
            groupPrivacy: layout && layout.Layout.Nav.Privacy,
            //registeredDate:new Date,
            followersCount: members && members.Members.Count || about && about.Members.Count
        };
    }
    private static evaluator = () => {
        const   links = Array.from(document.querySelectorAll<HTMLLinkElement>(config.membersCount.selector)),
                membersCount = ((_ : any ) => {
                    _ = _ && _.textContent;
                    _ = _ && _.match(config.membersCount.pattern);
                    _ = _ && _[1];
                    _ = _ && parseInt(_);
                    return _;
                })(links.find( x => x.textContent && x.textContent.match(config.membersCount.pattern) !== null));
    };
    private static mapper(friendsContent: any){
        return {
        }
    }
}
const getDataOn = 
    (groupPage: Nightmare) => 
    <TResult, TConfig>(tab: EGroupTabs, evaluator: (config: TConfig) => TResult, config: TConfig, promiseDoSomething?: () => Promise<any>) => 
    async (): Promise<TResult> => 
{
    let tryIfDown = 10;
    while (tryIfDown) {
        try {
            if (await gotoGroupTabOn(groupPage)(tab)) {
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
export const Groups = DataSelector.run
export const GroupMembers = async (groupPage) => {
    return await getDataOn(groupPage)(
        EGroupTabs.Members, getGroupMembers, configGroupMembers, 
        () => scrollDown(groupPage, { selector: configGroupMembers.Members.User.selector})
    )()
};