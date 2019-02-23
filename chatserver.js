const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer(f);
const io = require('socket.io').listen(server);


server.listen(3000);
server.on('request',(request,response)=>{
  let stream = fs.createReadStream('index.html');
  response.writeHead(200,{'Content-type':'text/html'});
  stream.pipe(response);
});
//ユーザー管理
let userHash = {};

io.on('connection',socket=>{
  socket.on('connected',name=>{
    let msg = name + 'さんが入室しました。';
    userHash[socket.id] = name;
    io.emit('publish',{value:msg});
  });
  socket.on('publish',data=>{
    console.log(data);
    io.emit('publish',{value:data.value});
  });
  socket.on('disconnect',()=>{
    let msg = userHash[socket.id] + "が退出しました";
    delete userHash[socket.id];
    io.emit("publish", {value: msg});
  });
});

const style_css = fs.readFileSync('css/styles.css','utf8')
function f(req,res){
  let url_parts = url.parse(req.url);

  if(url_parts.pathname=='/css/styles.css'){
    res.writeHead(200,{'Content-Type':'text/css'});
    res.write(style_css);
    res.end();
  }
}

