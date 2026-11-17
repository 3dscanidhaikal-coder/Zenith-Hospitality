const http=require('http');
const fs=require('fs');
const path=require('path');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 if(name.endsWith('/'))name+='index.html';
 const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(err,data)=>{if(err){return fs.readFile(path.join(root,'404.html'),(notFoundError,page)=>{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(notFoundError?'Page not found':page);});}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);});
}).listen(Number(process.env.PORT)||4180,'127.0.0.1',()=>console.log('Zenith next style: http://127.0.0.1:4180/'));
