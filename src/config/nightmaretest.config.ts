import * as Nightmare  from "nightmare";
import { getRandomInt } from "../utils/utils";

const  userAgents: string[] = require('user-agent-array');

export const nightmare = 
                new Nightmare({show:false})
                    .viewport(1200, 950)
                    .useragent(
                        true 
                        ? "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36"
                        : userAgents[getRandomInt(0,userAgents.length-1)]
                    )
                    //Googlebot/2.1 (+http://www.google.com/bot.html)