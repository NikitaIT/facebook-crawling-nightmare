export const config: PostsConfig = {
    Wrapper: {
        selector: `.userContentWrapper`
    },
    PostsHrefs:{
        selector: `a[href*="/posts/"]`
    },
    UserContent:{
        selector: ".userContent"
    },
    ExtraData: {
        selector: ".groupsEditLocationArea",
    },
    CommentsCount: {
        selector: `form a[aria-live="polite"][href*="${"comment"}"]`,
    },
    RepostsCount: {
        selector: `form a[aria-live="polite"][href*="${"shares"}"]`,
    },
    FeedCount: {
        Likes: {
            selector: 'form a[aria-label*="Like"]'
        },
        Love: {
            selector: 'form a[aria-label*="Love"]',
        },
        Wow: {
            selector: 'form a[aria-label*="Wow"]'
        },
    },
    QuotedPost: {
        selector: `.userContentWrapper [ajaxify*="/follow/"]`,
        Id:  {
            attribute: "ajaxify",
            pattern: /profile_id=(\d+)/.source
        },
        Value: {
            selector: `p`
        }
    },
    LinkImage: {
        selector: `a[rel="theater"][href*="{id}"] img`,
    },
    Place: {
        selector: `span[role="presentation"] ~ a`
    },
    Date: {
        selector: `abbr`
    },
};
export type PostsConfig = {
    Wrapper: {
        selector: string
    },
    PostsHrefs:{
        selector: string
    },
    UserContent:{
        selector: string
    },
    ExtraData: {
        selector: string
    },
    CommentsCount: {
        selector: string
    },
    RepostsCount: {
        selector: string
    },
    FeedCount: {
        Likes: {
            selector: string
        },
        Love: {
            selector: string
        },
        Wow: {
            selector: string
        },
    },
    QuotedPost: {
        selector: string
        Id:  {
            attribute: string
            pattern: string
        },
        Value: {
            selector: string
        }
    },
    LinkImage: {
        selector: string
    },
    Place: {
        selector: string
    },
    Date: {
        selector: string
    },
};