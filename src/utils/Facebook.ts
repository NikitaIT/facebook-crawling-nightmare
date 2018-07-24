import * as Nightmare from 'nightmare';
import { MetaHTMLAttributes } from 'react';
import { PageType } from '../Area/PageTypes';

export const goToPage = (
    nightmare : Nightmare, 
    id: string | number,
    pageType: PageType = PageType.Person,
    conf?: {
        rootUrl: string,
        PersonRoute: string,
        GroupRoute: string,
    }
) => {
    let config = {
        rootUrl: 'https://www.facebook.com',
        PersonRoute: '/profile.php',
        GroupRoute: '/groups',
        ...conf
    }
    if(pageType === PageType.Group){
        return nightmare.goto(`${config.rootUrl}${config.GroupRoute}/${id}`);
    }
    let queryUrl = config.rootUrl;
    switch (typeof(id)) {
        case 'string':
            queryUrl += `/${id}`;
            break;
        case 'number':
            queryUrl += `${config.PersonRoute}?id=${id}`;
            break;
        default:
            throw new TypeError(`Тип аргумента: ${typeof(id)}. Требуется string или number.`)
    }
    console.log("queryUrl", queryUrl)
    return nightmare.goto(queryUrl);
}

export const getUserIdByPage = (
    nightmare : Nightmare, 
    conf?: {
        Id:{
            profile:{
                selector: string,
                paramName: string,   
            },
            meta: {
                selector: string,
                pattern: RegExp
            }
        }
    }
): Promise<number> => {
    const config = {
        Id:{
            profile:{
                selector: `[href*="${"{paramName}"}"]`,
                paramName: 'referrer_profile_id',   
            },
            meta: {
                selector: 'meta[property*="url"][content*="profile"]',
                pattern: /(\d+)/.source
            }
        },
        ...conf
    }
    
    return nightmare
        .evaluate((config)=> {
                const selector = config.Id.profile.selector.replace("{paramName}", config.Id.profile.paramName);
                return (_=>_ && parseInt(_, 10))
                (
                    ((_:any)=>(
                        _ = _ && _.href,
                        _ = _ && _.split(`${config.Id.profile.paramName}=`).pop()
                    ))
                    (document.querySelector(selector)) 
                ||  
                    (_ => _ && _.content.match(new RegExp(config.Id.meta.pattern))[0])
                    (document.querySelector<HTMLMetaElement>(config.Id.meta.selector))
                );
        },config)
        .then();
}