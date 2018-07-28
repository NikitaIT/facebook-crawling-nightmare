import * as Nightmare  from "nightmare";
import { clickSafe } from "../../../utils/Nightmare";
export enum EPhotosTabs{
    PhotosOf = 'Photos of',
    Photos = "'s Photos",
    Albums = 'Albums'
}
export const gotoTabOn = (page: Nightmare) => ( selector:EPhotosTabs ) => 
clickSafe(page)(`a[role="tab"][name*="${selector}"]`);