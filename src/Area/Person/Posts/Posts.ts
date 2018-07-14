import { TGotoPageForProfile, MainNav } from "../../Nav";

export type TPostPage = {
    extraData?:Text,//.userContent
    replyOwnerId?:string, // 
    commentsCount?:number,
    location?:Text,
    date?:Date,
    feedCount:{
        likes?:number,
        love?:number,
        wow?:number,
    }
    reply?: {
        UserId:string,
        PostId:string,//ответ
    }
    lang?:string,//язык
    place?:Text,//место
    quotedPost?: {
        Id:number, // тот кого цитирут
        value: string // цитата
    }
    repostsCount?:number,
    platform?:string,
    text?:Text,
    url?:string,
    link?:string,
    linkName?:string,
    linkImage?:string
}
class DataSelector{
    public static run = ( gotoPageForProfile: TGotoPageForProfile, id: number ) => ()  : Promise<TPostPage[]> => {
        const   selector:string  = `.userContent`,
                selectorSection:string = `.userContentWrapper`,
                nm = gotoPageForProfile(MainNav.Timeline).wait(1000);

        
        return  new Promise((resolve,reject) =>{
            nm.evaluate((selectorSection)=> {
                return new Promise<boolean>((resolve,reject) =>{
                    let count = 0;
                    const timerId = setInterval( ()=> {
                        let prevCount = count;
                        count = document.querySelectorAll(selectorSection).length;
                        if(count == prevCount){
                            clearInterval(timerId);
                            resolve(true);
                        }
                        window.scrollBy(0, 10000);
                    },1000);
                });
            },selectorSection)
            .then((x: Promise<boolean>| boolean) => { //магия, где распаковался промис:?)
                if(x === true){
                    nm
                    .evaluate(DataSelector.postEvaluator,id)
                    //.then(DataSelector.mapper)
                    .then((c:TPostPage[])=> (console.log(c),resolve(c)))
                    .catch(console.error)
                }
            }
            )
        });
    };
    private static postEvaluator(id: number) : TPostPage[]{
        const   wrapper = Array.from(document.querySelectorAll<HTMLImageElement>(`.userContentWrapper`));
        
        return wrapper.map((x) : TPostPage=> {
                const   _uC = x.querySelector<HTMLDivElement>(".userContent"),
                        postHeader = _uC && _uC.previousElementSibling,
                        postsHrefs = postHeader && postHeader.querySelectorAll<HTMLLinkElement>(`a[href*="/posts/"]`),
                        _pH = postsHrefs && postsHrefs[postsHrefs.length > 1 ? 1 : 0],
                        url = _pH && _pH.href,
                        sharedA = postsHrefs && postsHrefs.length > 1 && postsHrefs[0] && postsHrefs[0].href,//не совсем правильно, шарить можно все что угодно
                        allAfterDate = postHeader && postHeader.querySelectorAll<HTMLLinkElement>(`span[role="presentation"] ~ a`),
                        place = allAfterDate && allAfterDate[0] && allAfterDate[0].href as any as Text,// или текст?
                        querySelectors = {
                            extraData: x && x.querySelector<HTMLDivElement>(".userContent"),
                            commentsCount:  x && x.querySelector<HTMLLinkElement>(`form a[aria-live="polite"][href*="${"comment"}"]`),
                            repostsCount: x &&  x.querySelector<HTMLLinkElement>(`form a[aria-live="polite"][href*="${"shares"}"]`),
                            feedCount: {
                                likes:  x && x.querySelector<HTMLLinkElement>('form a[aria-label*="Like"]'),
                                love:  x && x.querySelector<HTMLLinkElement>('form a[aria-label*="Love"]'),
                                wow:  x && x.querySelector<HTMLLinkElement>('form a[aria-label*="Wow"]')
                            },
                            quotedPost: {
                                Id:  x && x.querySelector<HTMLLinkElement>(`.userContentWrapper [ajaxify*="/follow/"]`),
                                value:  x && x.querySelector<HTMLLinkElement>(`.userContentWrapper [ajaxify*="/follow/"]`)
                            },
                            linkImage:  x && x.querySelector<HTMLImageElement>(`a[rel="theater"][href*="${id}"] img`),
                        };
                return {
                    extraData: querySelectors.extraData && querySelectors.extraData.textContent as any as Text,
                    commentsCount: querySelectors.commentsCount && parseInt(querySelectors.commentsCount.textContent || "0",10),
                    repostsCount: querySelectors.repostsCount && parseInt(querySelectors.repostsCount.textContent || "0",10),
                    feedCount: {
                        likes: querySelectors.feedCount.likes && parseInt(querySelectors.feedCount.likes.textContent || "0",10),
                        love: querySelectors.feedCount.love && parseInt(querySelectors.feedCount.love && querySelectors.feedCount.love.textContent || "0",10),
                        wow: querySelectors.feedCount.wow && parseInt(querySelectors.feedCount.wow.textContent || "0",10),
                    },
                    quotedPost: {
                        Id: querySelectors.quotedPost.Id && parseInt(querySelectors.quotedPost.Id
                            .attributes["ajaxify" as any].value
                            .match(/profile_id=(\d+)/)[1]
                            || "0",10),
                        value: ((_ : any) => {
                            _ = _ && _.parentElement;
                            _  = _ && _.querySelector("p");
                            _  = _ && _.textContent;
                            return _;
                        })(querySelectors.quotedPost.value)
                    },
                    lang: null,
                    linkImage: querySelectors.linkImage && querySelectors.linkImage.src,
                    url: url,
                    place: place,
                    date: ((_ : any) => {
                        _ = _ && _.title;
                        _  = _ && Date.parse(_.replace('pm', ":00 pm").replace('am', ":00 am"));
                        _  = _ && new Date(_);
                        return _;
                    })(postHeader && postHeader.querySelector<HTMLLinkElement>("abbr")),
                }
        });
    };
    private static mapper(){
        return {
        }
    }
}

export const PostPages = DataSelector.run