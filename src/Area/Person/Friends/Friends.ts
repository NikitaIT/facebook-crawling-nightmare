import * as React from 'react';
import { MainNav, TGotoPageForProfile } from '../../Nav';
import { findEndSubstring } from '../../../utils/utils';
import { scrollDown } from '../../../utils/Nightmare';
//#pagelet_timeline_medley_friends //[name="All Friends"] 
export enum EFriendsTabs{
    AllFriends = "All Friends",
    MutualFriends = "Mutual Friends",
    RecentlyAdded = "Recently Added",
    Following = "Following",
    Birthdays = "Birthdays",
    CurrentCity = "Current City",
    Work = "Work",
    Hometown = "Hometown",
}
export type TFriend = {
    id: number;
    name: string;
    accauntLink: string;
    accauntImage: {
        '100x100': string;
    };
}
/**
 * Не известный json в атребуте "data-gt" для вызова Tooltip
 */
type TFasebookDataGT = {
    engagement:{
        eng_type:string,
        eng_src: string,
        eng_tid: string,
        eng_data: any[]
    },
    coeff2_registry_key:string,
    coeff2_info:string,
    coeff2_action:string,
    coeff2_pv_signature:string
};
type TFriendsCount = { [name: string]: number | undefined };
export type TFriendsPage = { friends: TFriend[], friendsCount: TFriendsCount };
type TCardData = TFriend & { dataGt: string; }
type TFriendsTabsText = { [friendsTabValue: string]: string } 
type TFriendsContent = { cardData: TCardData[], friendsTabsText: TFriendsTabsText }
//#pagelet_timeline_medley_friends [data-testid="friend_list_item"] img

class DataSelector{
    public static run = ( gotoPageForProfile: TGotoPageForProfile ) => ()  : Promise<TFriendsPage> => {
        return  new Promise( async ( resolve, reject ) =>{
            const   selector:string  = `[data-testid="friend_list_item"]`,
                    selectorCounts:string = `[name="{0}"]`,
                    selectorSection:string = `[aria-role="region"]`,
                    nm = (await gotoPageForProfile(MainNav.Friends)).nightmare
                        .wait(`#pagelet_timeline_medley_friends`,2000);
            scrollDown(nm,{selector:selectorSection})
            .then((page) => {
                nm
                    .evaluate<string,string,string[],TFriendsContent>(DataSelector.evaluator, selector, selectorCounts, Object.values(EFriendsTabs))
                    .then(DataSelector.mapper)
                    .then((c)=> resolve(c))
                    .catch(console.error)
            }
            )
        });
    };
    private static evaluator = ( selector: string, selectorCounts: string, friendsTabs: string[]) => {
        const   images = Array.from(document.querySelectorAll<HTMLImageElement>(selector.concat(' img'))),
                links = Array.from(document.querySelectorAll<HTMLLinkElement>(selector.concat(' a'))),
                friendsTabsText: TFriendsTabsText  = {},
                toFriendsTabText = (friendsTabValue:string) => 
                {
                    const sel = document.querySelector<HTMLLinkElement>(selectorCounts.replace("{0}", friendsTabValue));
                    friendsTabsText[friendsTabValue] = sel && sel.textContent;
                },
                userDataByCardImage = (img: HTMLImageElement): TCardData => {
                    const   a = img.parentElement as HTMLLinkElement,
                            name = img.attributes["aria-label" as any].value,
                            link = links.find( y => y.innerText === name),
                            cardImage: TCardData = {
                                id: undefined,
                                name: name,
                                accauntLink: (a.href.split("?"))[0],
                                accauntImage: {
                                    '100x100': img.src
                                },
                                dataGt: link && link.dataset["gt"]
                            };
                    return cardImage;
                };
        
        friendsTabs.map(toFriendsTabText);

        return {
            cardData: images.map<TCardData>(userDataByCardImage),
            friendsTabsText: friendsTabsText
        };
    };
    private static mapper(friendsContent: TFriendsContent){
        const   friendsCount: TFriendsCount  = {},
                getUserIdFromFasebookDataGT = (x: any) => {
                    let id;
                    try{
                        id = parseInt(
                            (JSON.parse(x) as TFasebookDataGT).engagement.eng_tid,
                            10
                        );
                    } catch (e){
                        console.log("id",e);
                        id = null;
                    }
                    return id;
                },
                toFriendsCount = ([key ,value]: [string,string])=>{
                    friendsCount[key] = value && parseInt(
                        findEndSubstring( [value], key ),
                        10
                    );
                },
                friends: TFriend[] = friendsContent.cardData.map( x => ({
                    ...x,
                    id: getUserIdFromFasebookDataGT(x.dataGt)
                }));

        Object.entries(friendsContent.friendsTabsText).map(toFriendsCount);

        return {
            friends,
            friendsCount
        }
    }
}
export const Friends = DataSelector.run