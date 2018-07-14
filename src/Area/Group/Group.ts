import * as Nightmare from "nightmare";
import { gotoTabOn, EGroupTabs } from "./GroupTabs";
import { Group } from "../../models/Entity/Group";
type TGroupContent = {
}
class EGroupSelectors {
    membersCount = {
        selector: 'a[href*="/members/"]',
        pattern: /(\d+) Members/
    };
    nav = {
        selector: '[data-key="{0}"] a'
    }
    all = {
        extraData:"",
        name:"",
        screenName:"",
        email:"",//нету
        country:"",//нету
        location:"",//нету
        city:"",//нету
        address:"",//нету
        type:"",//нету
        description:"",
        phone:"",
        private_:"",
        premium:"",
        verified:"",
        homePage:"",
        homePageName:"",
        membersCount: "",
        ageFrom:"",
        dateFrom:"",
        dateTo:"",
        dateUpdated:"",
        dateLabel:"",
        photo:"#headerArea img.photo", //src
        photoSmall:"",
        photoMedium:"",
        photoLarge:"",
        admin:"",
        deleted:"",
        status:"",
        groupPrivacy:"",
        registeredDate:"",
        followersCount:""
    }
}
const config: EGroupSelectors = new EGroupSelectors();

class DataSelector{
    public static run = ( groupPage: Nightmare, id: string  ) => ()  : Promise<Group> => {
        const   gotoTab = gotoTabOn(groupPage),
                getData = <T>(tab: EGroupTabs) => (): Promise<T[]>  => 
                new Promise((resolve,reject) =>{
                    gotoTab(tab)
                    .then((x: Promise<boolean>| boolean) => { //магия, где распаковался промис:?)
                        if(x === true){
                            console.debug("then TPhotoPage start evaluator", tab);
                            groupPage
                            .evaluate(DataSelector.evaluator,id)
                            //.then(DataSelector.mapper)
                            .then((c:T[])=> (console.log(c),resolve(c)))
                            .catch(console.error)
                        }
                    })
                    .catch(console.error)
                });


        return new Promise((resolve,reject) =>{
            getData(EGroupTabs.About)().then(x => resolve(x as any as Group))
        });
    }
    private static evaluator(){
        const   links = Array.from(document.querySelectorAll<HTMLLinkElement>(config.membersCount.selector)),
                membersCount = ((_ : any ) => {
                    _ = _ && _.textContent;
                    _ = _ && _.match(config.membersCount.pattern);
                    _ = _ && _.match(config.membersCount.pattern)[1];
                    _ = _ && parseInt(_);
                    return _;
                })(links.find( x => x.textContent && x.textContent.match(config.membersCount.pattern) !== null))
                ;

        return  {
            id:"string",
            extraData:"" as any as Text,
            name:"string",
            screenName:"string",
            email:"string",
            country:""as any as Text,
            location:""as any as Text,
            city:""as any as Text,
            address:"string",
            type:"string",
            description:"string",
            phone:"string",
            private_:true,
            premium:true,
            verified:true,
            homePage:"string",
            homePageName:"",
            membersCount: membersCount,
            ageFrom:1,
            dateFrom:new Date,
            dateTo:new Date,
            dateUpdated:new Date,
            dateLabel:"string",
            photo:"string",//#headerArea img.photo
            photoSmall:"string",
            photoMedium:"string",
            photoLarge:"string",
            admin:"string",
            deleted:true,
            status:"string",
            groupPrivacy:"string",
            registeredDate:new Date,
            followersCount:1
        }
    };
    private static mapper(friendsContent: any){
        return {
        }
    }
}
export const Friends = DataSelector.run