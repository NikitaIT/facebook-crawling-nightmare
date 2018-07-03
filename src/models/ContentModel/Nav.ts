enum MainNav{
	Timeline = "timeline",
	About = "about",
	Friends = "friends",
	Photos = "photos",
	More = "", //wtf last-child
}
enum SubNav{
	Videos= "videos",
	CheckIns= "map",
	Sports= "sports",
	Music= "music",
	Movies= "movies",
	TVShows= "tv",
	Books= "books",
	AppsandGames = "games",
	Likes= "likes",
	Events= "events",
	Questions= "did_you_know",
	Reviews= "reviews",
	Notes= "notes",
	Instagram= "124024574287414" //wtf last-child
}
const NavSelector = "[data-tab-key*='{0}']";