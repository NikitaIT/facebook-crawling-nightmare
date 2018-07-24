import * as Nightmare from "nightmare";
import { Group } from "../../models/Entity/Group";
import { findNumberRegexp, chainPromiseFn } from "../../utils/utils";
import { gotoGroupTabOn, EGroupTabs } from "../Shared/Group/GroupTabs";
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
        const   gotoTab = gotoGroupTabOn(groupPage),
                getData = <T>(tab: EGroupTabs, evaluator: ()=> T) => async (): Promise<T>  => 
                {
                    try {
                        if (await gotoTab(tab)) {
                            console.debug("then Group start evaluator", tab);
                            return await groupPage.evaluate(evaluator).then<T>(_ => _);
                        } else{
                            console.debug("дерьмо с табом ", tab);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                },
                discussion = await getData(EGroupTabs.Discussion, getGroupDiscussion)(),
                layout = await getData(EGroupTabs.Discussion, getGroupLayout)(),
                about = await getData(EGroupTabs.About, getGroupAbout)(),
                members = await getData(EGroupTabs.Members, getGroupMembers)();
        
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
            membersCount: members && members.Members.Count,
            dateUpdated: about && about.Activity.CreatedAt,
            //dateLabel:"string",
            //photo:"string",//#headerArea img.photo
            //photoSmall:"string",
            //photoMedium:"string",
            //photoLarge:"string",
            admin: members && members.Members.AdminsAndModerators.Users[0],
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
/**
 * Публичная страница
 */
type TGroupDiscussion = {
    Location: string,
    Description: string
}
const getGroupDiscussion = (): TGroupDiscussion => {
    const   config = {
                Location: {
                    selector: ".groupsEditLocationArea",
                    replacePattern: /Location/i
                },
                Description: {
                    selector: ".groupsEditDescriptionArea",
                    replacePattern: /DESCRIPTION/i
                }
            };
                
    return {
        Location: 
            (_ => _ && _.textContent.replace(config.Location.replacePattern,""))
            (document.querySelector<HTMLElement>(config.Location.selector)),
        Description: 
            (_ => _ && _.textContent.replace(config.Description.replacePattern,""))
            (document.querySelector<HTMLElement>(config.Description.selector)),
    };
}

/**
 * Публичная страница
 */
type TPrivacy = "Public"|"Private"
type TGroupLayout = {
    Layout: {
        Nav:{
            Title: string,
            Privacy: TPrivacy
        }
    },
}
const getGroupLayout = (): TGroupLayout => {
    const   config = {
                Layout: {
                    Nav:{
                        Title: {
                            selector: "h1.seo_h1_tag"
                        },
                        Privacy: {
                            selector: "h1#seo_h1_tag ~div",
                            pattern: /(.*) Group/
                        }
                    }
                    
                },
            };
                
    return {
        Layout: {
            Nav:{
                Title: 
                    (_ => _ && _.textContent)
                    (document.querySelector<HTMLElement>(config.Layout.Nav.Title.selector)),
                Privacy: 
                    (_ => _ && _.textContent.match(config.Layout.Nav.Privacy.pattern)[1])
                    (document.querySelector<HTMLElement>(config.Layout.Nav.Privacy.selector)) as any as TPrivacy
            }
        },
    }
}
/**
 * Приватная страница
 */
type TGroupMembers = {
    Members: {
        Count: number,
        AdminsAndModerators: {
            Users:string[],
            Count: number
        }
    },
}
const getGroupMembers = (): TGroupMembers => {
    const   config = {
                Members: {
                    selector: "#groupsMemberBrowser",
                    Count: {
                        pattern: /Members ([\d|,|.]+)/
                    },
                    AdminsAndModerators: {
                        selector: "#groupsMemberSection_admins_moderators",
                        Users: {
                            selector: ".uiProfileBlockContent a"
                        },
                        Count: {
                            pattern: /(Admins and Moderators|Admin|Admin and Moderators|Admin and Moderator) ([\d|,|.]+)/
                        }
                    }
                    
                },
            },
            membersSection =  document.querySelector(config.Members.selector),
            adminsAndModeratorsSection = membersSection.querySelector(config.Members.AdminsAndModerators.selector),
            adminsAndModerators = Array.from(adminsAndModeratorsSection.querySelectorAll<HTMLLinkElement>(config.Members.AdminsAndModerators.Users.selector));
    return {
        Members: {
            Count: 
                ((_ : any) => (
                    _ = _ && _.textContent.match(config.Members.Count.pattern),
                    _ = _ && _[1],
                    _ = _ && _.replace(/[,|.]/, ""),
                    _ && parseInt(_)
                ))
                (membersSection),
            AdminsAndModerators: {
                Users: adminsAndModerators.map(_ => _.href),
                Count:
                    ((_ : any) => (
                        _ = _ && _.textContent.match(config.Members.Count.pattern),
                        _ = _ && _[2],
                        _ = _ && _.replace(/[,|.]/, ""),
                        _ && parseInt(_)
                    ))
                    (adminsAndModeratorsSection)
            }
        },
    }
}
/**
 * Публичная страница
 */
type TGroupAbout = {
    AboutThisGroup: {
        Description:  string,
        GroupType: string
    },
    Members: {
        Count: number,
        AdminsAndModerators: {
            Users:string[]
        }
    },
    Activity: {
        CreatedAt: Date
    }
}
const getGroupAbout = (): TGroupAbout => {
    const   config = {
                selector: "#content_container #pagelet_group_about",
                AboutThisGroup: {
                    startsWith: "About This Group",
                    Description: {
                        clickSelector: `[title="See More"]`,
                        pattern: /Description(.*)(See More|Group Type)/.source
                    },
                    GroupType: {
                        pattern: /Group Type(.*)/.source
                    }
                },
                Members: {
                    startsWith: "Members",
                    Count: {
                        pattern: /Members · ([\d|,|.]+)/.source
                    },
                    AdminsAndModerators: {
                        selector: "span",
                        selectorContainsPattern: /admin/i.source,
                        Users: {
                            selector: "a"
                        }
                    }
                },
                Activity: {
                    startsWith: "Activity",
                    CreatedAt:{
                        selector: "abbr.timestamp"
                    }
                }
            },
            aboutSections = 
                (_ => (_ && Array.from(_.children) || []) as Element[] ) 
                (document.querySelector(config.selector)),
            aboutThisGroup = aboutSections.find(x=> x.textContent.startsWith(config.AboutThisGroup.startsWith)),
            members = aboutSections.find(x=> x.textContent.startsWith(config.Members.startsWith)),
            activity = aboutSections.find(x=> x.textContent.startsWith(config.Activity.startsWith)),
            adminsAndModeratorsSection = (
                    ( _ => _ && Array.from( _.querySelectorAll(config.Members.AdminsAndModerators.selector)) || [])            
                    (members) 
                ).find(_ => _.textContent.search(new RegExp(config.Members.AdminsAndModerators.selectorContainsPattern)) != -1),
            adminsAndModerators = 
                ( _ => _ && Array.from( _.querySelectorAll<HTMLLinkElement>(config.Members.AdminsAndModerators.Users.selector)) || [])
                (adminsAndModeratorsSection);
    return {
        AboutThisGroup: {
            Description:  
                (_ => (_ && _.textContent.match(new RegExp(config.AboutThisGroup.GroupType.pattern))[1]))
                (aboutThisGroup),
            GroupType:
                (_ => (_ && _.textContent.match(new RegExp(config.AboutThisGroup.GroupType.pattern))[1]))
                (aboutThisGroup)
        },
        Members: {
            Count:
                ((_ : any) => (
                    _ = _ && _.textContent.match(new RegExp(config.Members.Count.pattern))[1],
                    _ = _ && _.replace(/[,|.]/, ""),
                    _ && parseInt(_)
                ))
                (members),
            AdminsAndModerators: {
                Users: adminsAndModerators.map(_ => _.href)
            }
        },
        Activity: {
            CreatedAt:
                ((_ : any) => (
                    _ = _ && _.querySelector(config.Activity.CreatedAt.selector),
                    _ = _ && _.title,
                    _ = _ && Date.parse(_.replace("at ", "")),
                    _ && new Date(_)
                ))
                (activity)
        }
    }
}


export const Groups = DataSelector.run