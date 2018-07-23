import * as Nightmare from 'nightmare';
import { MetaHTMLAttributes } from 'react';

export const goToPage = (
    nightmare : Nightmare, 
    id: string | number, 
    conf?: {
        rootUrl: string,
        profileRoute: string
    }
) => {
    let config = {
        rootUrl: 'https://www.facebook.com/',
        profileRoute: 'profile.php',
        ...conf
    }
    let queryUrl = config.rootUrl;
    switch (typeof(id)) {
        case 'string':
            queryUrl += id;
            break;
        case 'number':
            queryUrl += config.profileRoute + '?id=' + id;
            break;
        default:
            throw new TypeError(`Тип аргумента: ${typeof(id)}. Требуется string или number.`)
    }
    console.log("queryUrl:",queryUrl);
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