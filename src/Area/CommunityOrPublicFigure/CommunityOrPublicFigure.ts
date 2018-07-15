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
const getGroupAbout = (): TGroupAbout  => {
    const   config = {
                selector: "#content_container",
                wait: `[id*="PagesProfileAboutInfoPagelet"]`,
                FindUs:{
                    selector: `a[ajaxify*="/places/map/"]`,
                    Call:{
                        pattern: /Call ([\d|,|.|\s|\+|(|)]+)/,
                        replace: /[,|.|\s|\+|(|)]/
                    },
                    Mme:{
                        pattern:/m.me\/(\d+)/
                    }
                },
                Hours: {
                    pattern: /HOURS(.*)PAGE INFO/,

                },
                PageInfo:{
                    pattern: /PAGE INFO(.*)CONTACT INFO/
                },
                ContactInfo:{
                    pattern: /CONTACT INFO(.*)MORE INFO/
                },
                MoreInfo:{
                    pattern: /MORE INFO(.*)/,
                    About:{
                        pattern: /About(.*)Community/,
                    }
                },
                Story: {
                    click: `[href*="/story/]`,
                    wait: `button[title="Close Note"]`,
                    pattern: /STORY(.*)/
                }
            },
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
                    _ = _ && _.replace(config.FindUs.Call.replace, ""),
                    _ && parseInt(_)
                ))(textContent.match(config.FindUs.Call.pattern)[1]),
            Mme: 
                ((_ : any) => (
                    _ && parseInt(_)
                ))(textContent.match(config.FindUs.Mme.pattern)[1])
        },
        Hours: textContent.match(config.Hours.pattern)[1],
        PageInfo: textContent.match(config.PageInfo.pattern)[1],
        ContactInfo: textContent.match(config.ContactInfo.pattern)[1],
        MoreInfo: textContent.match(config.MoreInfo.pattern)[1],
        Story: textContent.match(config.Story.pattern)[1]
    };
}
/**
 * Публичная страница
 */
type TGroupCommunity = {
    TotalFollows: number,
    TotalLikes: number
}
const getGroupCommunity = (): TGroupCommunity => {
    const   config = {
                selector: "#content_container",
                wait: `#pagelet_rhc_footer`,
                TotalLikes: {
                    pattern: /([\d|,|.|\s]+)Total Likes/,
                    replace: /[,|.|\s]/
                },
                TotalFollows:{
                    pattern: /([\d|,|.|\s]+)Total Follows/,
                    replace: /[,|.|\s]/
                }
            },
            textContent = 
                (_ => _ && _.textContent || "")
                (document.querySelector<HTMLElement>(config.selector));
                
    return {
        TotalFollows: 
            ((_ : any) => (
                _ = _ && _.replace(config.TotalLikes.replace, ""),
                _ && parseInt(_)
            ))(textContent.match(config.TotalLikes.pattern)[1]),
        TotalLikes: 
            ((_ : any) => (
                _ = _ && _.replace(config.TotalLikes.replace, ""),
                _ && parseInt(_)
            ))(textContent.match(config.TotalFollows.pattern)[1]),
    };
}