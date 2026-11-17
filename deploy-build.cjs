const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=__dirname;
execFileSync(process.execPath,[path.join(root,'build.cjs')],{stdio:'inherit'});
execFileSync(process.execPath,[path.join(root,'check.cjs')],{stdio:'inherit'});
const output=path.join(root,'dist');
fs.mkdirSync(output,{recursive:true});
for(const file of fs.readdirSync(root)){
 if(/\.(html|css|js)$/.test(file)&&file!=='qa.html')fs.copyFileSync(path.join(root,file),path.join(output,file));
}
fs.cpSync(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
console.log('Static website ready in dist/');
