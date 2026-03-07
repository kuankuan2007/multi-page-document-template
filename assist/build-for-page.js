import {build} from 'vite'
import fs from 'fs'
build({
    base: "/multi-page-document-template/"
}).then(()=>{
    fs.copyFileSync("dist/index.html", "dist/404.html")
})