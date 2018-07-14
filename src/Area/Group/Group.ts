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
    public static run = ( groupPage: Nightmare, id: string  ) => ()  : Promise<Group> => {
        const   gotoTab = gotoGroupTabOn(groupPage),
                getData = <T>(tab: EGroupTabs, evaluator: ()=> T) => (): Promise<T[]>  => 
                new Promise((resolve,reject) =>{
                    gotoTab(tab)
                    .then((x: Promise<boolean>| boolean) => { //магия, где распаковался промис:?)
                        if(x === true){
                            console.debug("then TPhotoPage start evaluator", tab);
                            groupPage
                            .evaluate(evaluator,id)
                            //.then(DataSelector.mapper)
                            .then((c:T[])=> (console.log(c),resolve(c)))
                            .catch(console.error)
                        }
                    })
                    .catch(console.error)
                });


        return new Promise((resolve,reject) =>{
            chainPromiseFn([
                getData(EGroupTabs.Discussion, getGroupDiscussion),
                getData(EGroupTabs.Discussion, getGroupLayout),
                getData(EGroupTabs.About, getGroupAbout),
                getData(EGroupTabs.Members, getGroupMembers),
            ])
            .then(x => resolve(x as any as Group))
        });
    }
    private static evaluator(){
        const   links = Array.from(document.querySelectorAll<HTMLLinkElement>(config.membersCount.selector)),
                membersCount = ((_ : any ) => {
                    _ = _ && _.textContent;
                    _ = _ && _.match(config.membersCount.pattern);
                    _ = _ && _[1];
                    _ = _ && parseInt(_);
                    return _;
                })(links.find( x => x.textContent && x.textContent.match(config.membersCount.pattern) !== null)),
                discussion = getGroupDiscussion(),
                layout = getGroupLayout(),
                about = getGroupAbout(),
                members = getGroupMembers();

        return  {
            id:"string",
            extraData:"" as any as Text,
            name:"string",
            screenName:"string",
            email:"string",
            country:""as any as Text,
            location:""as any as Text,
            city:""as any as Text,
            address:"string",
            type:"string",
            description:"string",
            phone:"string",
            private_:true,
            premium:true,
            verified:true,
            homePage:"string",
            homePageName:"",
            membersCount: membersCount,
            ageFrom:1,
            dateFrom:new Date,
            dateTo:new Date,
            dateUpdated:new Date,
            dateLabel:"string",
            photo:"string",//#headerArea img.photo
            photoSmall:"string",
            photoMedium:"string",
            photoLarge:"string",
            admin:"string",
            deleted:true,
            status:"string",
            groupPrivacy:"string",
            registeredDate:new Date,
            followersCount:1
        }
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
type TGroupLayout = {
    Layout: {
        Nav:{
            Title: string,
            Privacy: string
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
                    (document.querySelector<HTMLElement>(config.Layout.Nav.Privacy.selector))
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
                    _ = _ && _.textContent.match(config.Members.Count.pattern)[1],
                    _ = _ && _.replace(/[,|.]/, ""),
                    _ && parseInt(_)
                ))
                (membersSection),
            AdminsAndModerators: {
                Users: adminsAndModerators.map(_ => _.href),
                Count:
                    ((_ : any) => (
                        _ = _ && _.textContent.match(config.Members.Count.pattern)[2],
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
                        pattern: /Description(.*)See More/
                    },
                    GroupType: {
                        pattern: /Group Type(.*)/
                    }
                },
                Members: {
                    startsWith: "Members",
                    Count: {
                        pattern: /Members · ([\d|,|.]+)/
                    },
                    AdminsAndModerators: {
                        selector: "span",
                        selectorContainsPattern: /admin/i,
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
                ).find(_ => _.textContent.search(config.Members.AdminsAndModerators.selectorContainsPattern) != -1),
            adminsAndModerators = 
                ( _ => _ && Array.from( _.querySelectorAll<HTMLLinkElement>(config.Members.AdminsAndModerators.Users.selector)) || [])
                (adminsAndModeratorsSection);
    return {
        AboutThisGroup: {
            Description:  
                (_ => (_ && _.textContent.match(config.AboutThisGroup.GroupType.pattern)[1]))
                (aboutThisGroup),
            GroupType:
                (_ => (_ && _.textContent.match(config.AboutThisGroup.GroupType.pattern)[1]))
                (aboutThisGroup)
        },
        Members: {
            Count:
                ((_ : any) => (
                    _ = _ && _.textContent.match(config.Members.Count.pattern)[1],
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