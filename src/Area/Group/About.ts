import { TGroupAboutConfig } from "./group.config";

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

export const getGroupAbout = (config: TGroupAboutConfig): TGroupAbout => {
    const   aboutSections = 
                (_ => (_ && Array.from(_.children) || []) as Element[] ) 
                (document.querySelector(config.selector)),
            aboutThisGroup = aboutSections.find(x=> x.textContent.startsWith(config.AboutThisGroup.startsWith)),
            members = aboutSections.find(x=> x.textContent.startsWith(config.Members.startsWith)),
            activity = aboutSections.find(x=> x.textContent.startsWith(config.Activity.startsWith)),
            adminsAndModeratorsSection = (
                    ( _ => _ && Array.from( _.querySelectorAll(config.Members.AdminsAndModerators.selector)) || [])            
                    (members) 
                ).find(_ => _.textContent.search(eval(config.Members.AdminsAndModerators.selectorContainsPattern)) != -1),
            adminsAndModerators = 
                ( _ => _ && Array.from( _.querySelectorAll<HTMLLinkElement>(config.Members.AdminsAndModerators.Users.selector)) || [])
                (adminsAndModeratorsSection);
    return {
        AboutThisGroup: {
            Description:  
                (_ => (_ && _.textContent.match(eval(config.AboutThisGroup.Description.pattern))[1]))
                (aboutThisGroup),
            GroupType:
                (_ => (_ && _.textContent.match(eval(config.AboutThisGroup.GroupType.pattern))[1]))
                (aboutThisGroup)
        },
        Members: {
            Count:
                ((_ : any) => (
                    _ = _ && _.textContent.match(eval(config.Members.Count.pattern))[1],
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