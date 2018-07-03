//#pagelet_timeline_medley_friends //[name="All Friends"] 
enum FriendsTabs{
    AllFriends = "All Friends",
    MutualFriends = "Mutual Friends",
    RecentlyAdded = "Recently Added",
    Following = "Following",
}
type FriendsCount = {
    AllFriendsCount:number, 
    MutualFriendsCount:number,
    RecentlyAddedCount:number,
    FollowingCount:number,
}
//#pagelet_timeline_medley_friends [data-testid="friend_list_item"]