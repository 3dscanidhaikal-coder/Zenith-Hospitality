const fs=require('fs'),path=require('path');
const root=__dirname,errors=[];
for(const file of fs.readdirSync(root).filter(n=>n.endsWith('.html')&&n!=='qa.html')){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 for(const [,url]of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:|tel:|#)/.test(url))continue;
  const [name,hash]=url.split('#'),target=path.join(root,name);
  if(!fs.existsSync(target))errors.push(file+': missing '+name);
  else if(hash&&!fs.readFileSync(target,'utf8').includes('id="'+hash+'"'))errors.push(file+': missing #'+hash);
 }
 if(/[—–]/.test(html))errors.push(file+': prohibited dash');
 if((html.match(/<h1/g)||[]).length!==1)errors.push(file+': invalid H1 count');
}
console.log(errors.length?errors:'All generated pages pass assets, links, fragment targets, H1 and punctuation checks.');
process.exitCode=errors.length?1:0;
