const systemMedia=window.matchMedia('(prefers-color-scheme: dark)')

type Themes='light'|'dark'|'auto'
type styleTheme='light'|'dark'
type ThemeConfig={
    onChangeIn:() => styleTheme,
    onChangeOut?:() => void,
    icon:string
}
function onSystemThemeChange(){
    changeTheme('auto')
}
import darkIcon from './icons/dark.svg?raw'
import lightIcon from './icons/light.svg?raw'
import osIcon from './icons/os.svg?raw'

export const themeConfigs:{[key in Themes]:ThemeConfig} = {
    light:{
        onChangeIn:() => 'light',
        icon: lightIcon
    },
    dark:{
        onChangeIn:()=>"dark",
        icon: darkIcon
    },
    auto:{
        onChangeIn:function(){
            systemMedia.addEventListener('change',onSystemThemeChange)
            return systemMedia.matches?'dark':'light'
        },
        onChangeOut:function(){
            systemMedia.removeEventListener("change",onSystemThemeChange)
        },
        icon: osIcon
    }
}
let nowTheme:Themes;
let nowStyleTheme:styleTheme;
const themeCallbacks:((theme:Themes)=>void)[]=[];
const styleThemeCallbacks:((theme:styleTheme)=>void)[]=[];
export function getTheme(callback:(theme:Themes)=>void){
    themeCallbacks.push(callback);
    callback(nowTheme);
    return ()=>{
        themeCallbacks.splice(themeCallbacks.indexOf(callback),1);
    }
}
export function getStyleTheme(callback:(theme:styleTheme)=>void){
    styleThemeCallbacks.push(callback);
    callback(nowStyleTheme);
    return ()=>{
        styleThemeCallbacks.splice(styleThemeCallbacks.indexOf(callback),1);
    }
}
export function changeTheme(theme:Themes){
    const styleTheme = themeConfigs[theme].onChangeIn();
    nowStyleTheme = styleTheme;
    nowTheme = theme;
    styleThemeCallbacks.forEach(callback=>callback(styleTheme));
    themeCallbacks.forEach(callback=>callback(theme));
    localStorage.setItem('theme',theme);
}

(function (){
    let theme=localStorage.getItem('theme');
    if (theme && theme in themeConfigs){
        changeTheme(theme as Themes)
    }
    else{
        changeTheme('auto')
    }
})()

getStyleTheme((styleTheme)=>{
    document.documentElement.dataset.theme=styleTheme
})
