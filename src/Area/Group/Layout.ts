import { TGroupLayoutConfig } from "./group.config";

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

export const getGroupLayout = (config: TGroupLayoutConfig): TGroupLayout => {
                
    return {
        Layout: {
            Nav:{
                Title: 
                    (_ => _ && _.textContent)
                    (document.querySelector<HTMLElement>(config.Layout.Nav.Title.selector)),
                Privacy: 
                    (_ => _ && _.textContent.match(eval(config.Layout.Nav.Privacy.pattern))[1])
                    (document.querySelector<HTMLElement>(config.Layout.Nav.Privacy.selector)) as any as TPrivacy
            }
        },
    }
}