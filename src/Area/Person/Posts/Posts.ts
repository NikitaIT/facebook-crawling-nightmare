import { TGotoPageForProfile, MainNav } from "../../Nav";
import { config, PostsConfig } from "./posts.config";
import { getUserIdByPage } from "../../../utils/Facebook";
import * as Nightmare from "nightmare";
import { scrollDown } from "../../../utils/Nightmare";

export type TPostPage = {
    extraData?: string,//.userContent
    replyOwnerId?:string, // 
    commentsCount?:number,
    location?:string,
    date?:Date | string,
    feedCount?:{
        likes:number,
        love:number,
        wow:number,
    }
    reply?: {
        UserId:string,
        PostId:string,//ответ
    }
    lang?:string,//язык
    place?: string,//место
    quotedPost?: {
        Id:number, // тот кого цитирут
        value: string // цитата
    }
    repostsCount?:number,
    platform?:string,
    text?: string,
    url?:string,
    link?:string,
    linkName?:string,
    linkImage?:string
}

class DataSelector{
    public static run = ( gotoPageForProfile: TGotoPageForProfile ) =>  ()  : Promise<TPostPage[]> => 
        new Promise( async ( resolve, reject ) =>{
            const	gotoTimeline = (await gotoPageForProfile(MainNav.Timeline)).nightmare;

            scrollDown(gotoTimeline).then(n => 
            getUserIdByPage(gotoTimeline)
                .then(id => {
                    gotoTimeline
                        .wait(2000)
                        .evaluate(DataSelector.postEvaluator, id, config)
                        //.then(DataSelector.mapper)
                        .then((c: TPostPage[]) => (console.log("cc",c), resolve(c)))
                        .catch(console.error)
                })
                .catch(console.error)
            )
        });
    private static postEvaluator = (id: number,config: PostsConfig) : TPostPage[] => {
        const   wrapper = Array.from(document.querySelectorAll<HTMLImageElement>(config.Wrapper.selector));
        
        return wrapper.map((x) : TPostPage=> {
                const   
                        userContent = x.querySelector<HTMLDivElement>(config.UserContent.selector),
                        postHeader = 
                            (_ => _ && _.previousElementSibling)
                            (userContent),
                        postsHrefs = 
                            (_ => _ && _.querySelectorAll<HTMLLinkElement>(config.PostsHrefs.selector))
                            (postHeader),
                            url = 
                            ((_ : any ) => (
                                _ = _ && _[_.length > 1 ? 1 : 0],
                                _ && _.href
                            ))
                            (postsHrefs),
                        sharedA = 
                            (_=> _ && _.length > 1 && _[0] && _[0].href)
                            (postsHrefs),//не совсем правильно, шарить можно все что угодно
                        place = 
                            ((_ : any ) => (
                                _ = _ && _.querySelectorAll(config.Place.selector),
                                _ && _[0] && _[0].href
                            ))
                            (postHeader),// или текст?
                        querySelectors = {
                            extraData: x && x.querySelector<HTMLDivElement>(config.ExtraData.selector),
                            commentsCount:  x && x.querySelector<HTMLLinkElement>(config.CommentsCount.selector),
                            repostsCount: x &&  x.querySelector<HTMLLinkElement>(config.RepostsCount.selector),
                            feedCount: {
                                likes:  x && x.querySelector<HTMLLinkElement>(config.FeedCount.Likes.selector),
                                love:  x && x.querySelector<HTMLLinkElement>(config.FeedCount.Love.selector),
                                wow:  x && x.querySelector<HTMLLinkElement>(config.FeedCount.Wow.selector)
                            },
                            quotedPost: {
                                Id:  x && x.querySelector<HTMLLinkElement>(config.QuotedPost.selector),
                                value:  x && x.querySelector<HTMLLinkElement>(config.QuotedPost.selector)
                            },
                            linkImage:  x && x.querySelector<HTMLImageElement>(config.LinkImage.selector.replace("{id}",id.toString())),
                        }; 
                return {
                    extraData: querySelectors.extraData && querySelectors.extraData.textContent,
                    commentsCount: querySelectors.commentsCount && parseInt(querySelectors.commentsCount.textContent || "0",10) || 0,
                    repostsCount: querySelectors.repostsCount && parseInt(querySelectors.repostsCount.textContent || "0",10) || 0,
                    feedCount: {
                        likes: querySelectors.feedCount.likes && parseInt(querySelectors.feedCount.likes.textContent || "0",10) || 0,
                        love: querySelectors.feedCount.love && parseInt(querySelectors.feedCount.love && querySelectors.feedCount.love.textContent || "0",10) || 0,
                        wow: querySelectors.feedCount.wow && parseInt(querySelectors.feedCount.wow.textContent || "0",10) || 0,
                    },
                    quotedPost: {
                        Id: querySelectors.quotedPost.Id && parseInt(querySelectors.quotedPost.Id
                            .attributes[config.QuotedPost.Id.attribute as any].value
                            .match(eval(config.QuotedPost.Id.pattern))[1]
                            || "0",10) || null,
                        value: ((_ : any) => (
                            _ = _ && _.parentElement,
                            _ = _ && _.querySelector(config.QuotedPost.Value.selector),
                            _ && _.textContent
                        ))(querySelectors.quotedPost.value)
                    },
                    lang: null,
                    linkImage: querySelectors.linkImage && querySelectors.linkImage.src,
                     url: url,
                    place: place,
                    date: ((_ : any) => (
                        _ = _ && _.querySelector(config.Date.selector),
                        _ = _ && _.title,
                        _ = _ && Date.parse(_.replace('pm', ":00 pm").replace('am', ":00 am")),
                        _ = _ && new Date(_),
                        _
                    ))(postHeader),
                }
        });
    };
    private static mapper(){
        return {
        }
    }
}

export const PostPages = DataSelector.run