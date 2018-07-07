import * as Nightmare  from "nightmare";
export enum EPhotosTabs{
    PhotosOf = 'Photos of',
    Photos = ' Photos',
    Albums = 'Albums'
}
export const gotoTabOn = (page: Nightmare) => ( selector:EPhotosTabs ) => page
				.wait(`a[role="tab"][name*="${selector}"]`)
                .click(`a[role="tab"][name*="${selector}"]`)
                .refresh(); // чтобы в доме лежал только текущий таб (иначе они не отличимы)