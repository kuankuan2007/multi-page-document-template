import content from "../content";
/**
 * 
 * @param {Array<string>} nameList 
 */
export default function(nameList){
    let nowContent = content
    for (const i of nameList){
        if (nowContent.subArticles && i in nowContent.subArticles){
            nowContent=nowContent.subArticles[i]
        }else{
            return null
        }
    }
    return nowContent
}