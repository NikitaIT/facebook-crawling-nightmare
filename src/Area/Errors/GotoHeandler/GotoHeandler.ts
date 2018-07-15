import * as Nightmare  from "nightmare";
const gotoHeandler = (nightmare: Nightmare) => (gotoResult) => {
    if (200 === gotoResult.code) {
        return nightmare;
    } else {
        console.error("Error code:", gotoResult.code, " Goto result:", gotoResult)
    }
}