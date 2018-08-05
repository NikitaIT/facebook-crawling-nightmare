/**
 * Публичная страница
 */
type TGroupCommunity = {
    TotalFollows: number,
    TotalLikes: number
}
export const getGroupCommunity = (): TGroupCommunity => {
    const   config = {
                selector: "#content_container",
                wait: `#pagelet_rhc_footer`,
                TotalLikes: {
                    pattern: /([\d|,|.|\s]+)Total Likes/.toString(),
                    replace: /[,|.|\s]/.toString()
                },
                TotalFollows:{
                    pattern: /([\d|,|.|\s]+)Total Follows/.toString(),
                    replace: /[,|.|\s]/.toString()
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
            ))(textContent.match(eval(config.TotalLikes.pattern))[1]),
        TotalLikes: 
            ((_ : any) => (
                _ = _ && _.replace(eval(config.TotalLikes.replace), ""),
                _ && parseInt(_)
            ))(textContent.match(eval(config.TotalFollows.pattern))[1]),
    };
}