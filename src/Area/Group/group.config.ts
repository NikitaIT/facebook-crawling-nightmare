export const configGroupMembers : TGroupMembersConfig = {
    Members: {
        selector: "#groupsMemberBrowser",
        User: {
            selector: `[data-name="GroupProfileGridItem"]`,
            Accaunt:{
                selector: ".uiProfileBlockContent a"
            },
            Id: {
                pattern: /(\d+)/.toString(),
                data: "testid"
            },
            Img:{
                selector: "img",
                Name:{
                    attribute: "aria-label"
                }
            }
        },
        AdminsAndModerators: {
            selector: "#groupsMemberSection_admins_moderators",
            
            Count: {
                pattern: /(Admins and Moderators|Admin|Admin and Moderators|Admin and Moderator) ([\d|,|.]+)/.toString()
            }
            
        },
        Members: {
            selector: "#groupsMemberSection_recently_joined",
            Count: {
                pattern: /Members([\d|,|.]+)/.toString()
            },
        }
        
    },
};
export type TGroupMembersConfig = {
    Members: {
        selector: string,
        User: {
            selector: string,
            Accaunt:{
                selector: string
            },
            Id: {
                pattern: string,
                data: string
            },
            Img:{
                selector: string,
                Name:{
                    attribute: string
                }
            }
        },
        AdminsAndModerators: {
            selector: string,
            
            Count: {
                pattern: string
            }
            
        },
        Members: {
            selector: string,
            Count: {
                pattern: string
            },
        }       
    },
}

export const  configGroupLayout : TGroupLayoutConfig = {
    Layout: {
        Nav:{
            Title: {
                selector: "h1#seo_h1_tag"
            },
            Privacy: {
                selector: "h1#seo_h1_tag ~div",
                pattern: /(.*) Group/.toString()
            }
        }
        
    },
};
export type TGroupLayoutConfig = {
    Layout: {
        Nav:{
            Title: {
                selector: string
            },
            Privacy: {
                selector: string,
                pattern: string
            }
        }
    },
};
export const   configGroupDiscussion : TGroupDiscussionConfig = {
    Location: {
        selector: ".groupsEditLocationArea",
        replacePattern: /Locations/ig.toString()
    },
    Description: {
        selector: ".groupsEditDescriptionArea",
        replacePattern: /DESCRIPTION/i.toString()
    }
};
export type TGroupDiscussionConfig = {
    Location: {
        selector: string,
        replacePattern: string
    },
    Description: {
        selector: string,
        replacePattern: string
    }
};
export const   configGroupAbout : TGroupAboutConfig = {
    selector: "#content_container #pagelet_group_about",
    AboutThisGroup: {
        startsWith: "About This Group",
        Description: {
            clickSelector: `[title="See More"]`,
            pattern: /Description(.*)(See More|Group Type)/.toString()
        },
        GroupType: {
            pattern: /Group Type(.*)/.toString()
        }
    },
    Members: {
        startsWith: "Members",
        Count: {
            pattern: /Members · ([\d|,|.]+)/.toString()
        },
        AdminsAndModerators: {
            selector: "span",
            selectorContainsPattern: /admin/i.toString(),
            Users: {
                selector: "a"
            }
        }
    },
    Activity: {
        startsWith: "Activity",
        CreatedAt:{
            selector: "abbr.timestamp"
        }
    }
}
export type TGroupAboutConfig = {
    selector: string,
    AboutThisGroup: {
        startsWith: string,
        Description: {
            clickSelector: string,
            pattern: string
        },
        GroupType: {
            pattern: string
        }
    },
    Members: {
        startsWith: string,
        Count: {
            pattern: string
        },
        AdminsAndModerators: {
            selector: string,
            selectorContainsPattern: string,
            Users: {
                selector: string
            }
        }
    },
    Activity: {
        startsWith: string,
        CreatedAt:{
            selector: string
        }
    }
}