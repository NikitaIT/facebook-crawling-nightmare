import { Person } from "../../models/Entity/Person";
import { TGroupMembersConfig } from "./group.config";

/**
 * Приватная страница
 */
type TGroupMembers = {
    Members: {
        Count: number,
        AdminsAndModerators: {
            Users:Person[],
            Count: number
        },
        Members: {
            Users: Person[],
            Count: number
        }
    },
}
export const getGroupMembers = (config: TGroupMembersConfig): TGroupMembers => {
    const   getUsers = (x:HTMLDivElement): Person => {
                return {
                    id: ((
                        _ : any,
                        __: any, 
                        f = (_ : any) => (
                            _ = _ && _.match(eval(config.Members.User.Id.pattern)),
                            _ = _ && _[0],
                            _ && parseInt(_).toString()
                        )
                    ) => f(_) || f(__))
                    (x.id, x.dataset[config.Members.User.Id.data]),
                    name: 
                        ((_ : any) => (
                            _ = _ && _.attributes[config.Members.User.Img.Name.attribute],
                            _ && _.value
                        ))
                        (x.querySelector<HTMLImageElement>(config.Members.User.Img.selector)),
                    photoSmall: 
                        (_ => _ && _.src)
                        (x.querySelector<HTMLImageElement>(config.Members.User.Img.selector)),
                    url: 
                        (_ => _ && _.href)
                        (x.querySelector<HTMLLinkElement>(config.Members.User.Accaunt.selector))
                }
            },
            membersSection =  document.querySelector(config.Members.selector),
            adminsAndModeratorsSection = membersSection.querySelector(config.Members.AdminsAndModerators.selector),
            adminsAndModeratorsUserCardRows = Array.from(adminsAndModeratorsSection.querySelectorAll<HTMLDivElement>(config.Members.User.selector)),
            membersUserCardRows = Array.from(membersSection.querySelectorAll<HTMLDivElement>(
                `${config.Members.Members.selector} ${config.Members.User.selector}`
            ));
    return {
        Members: {
            Count: 
                ((_ : any) => (
                    _ = _ && _.textContent.match(eval(config.Members.Members.Count.pattern)),
                    _ = _ && _[1],
                    _ = _ && _.replace(/[,|.]/, ""),
                    _ && parseInt(_)
                ))
                (membersSection),
            AdminsAndModerators: {
                Users: adminsAndModeratorsUserCardRows.map(getUsers),
                Count:
                    ((_ : any) => (
                        _ = _ && _.textContent.match(eval(config.Members.Members.Count.pattern)),
                        _ = _ && _[2],
                        _ = _ && _.replace(/[,|.]/, ""),
                        _ && parseInt(_)
                    ))
                    (adminsAndModeratorsSection)
            },
            Members: {
                Users: membersUserCardRows.map<Person>(getUsers),
                Count: membersUserCardRows.length
            }
        },
    }
}
