import { TGroupDiscussionConfig } from "./group.config";
import { new_RegExp_fromString } from "../../utils/utils";

/**
 * Публичная страница
 */
type TGroupDiscussion = {
    Location: string,
    Description: string
}

export const getGroupDiscussion = (config:  TGroupDiscussionConfig): TGroupDiscussion => {
                
    return {
        Location:
            (_ => _ && _.textContent.replace(eval(config.Location.replacePattern),""))
            (document.querySelector<HTMLElement>(config.Location.selector)),
        Description: 
            (_ => _ && _.textContent.replace(eval(config.Description.replacePattern),"").replace("See More",""))
            (document.querySelector<HTMLElement>(config.Description.selector)),
    };
}