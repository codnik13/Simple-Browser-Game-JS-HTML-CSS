var runner, debris=[], debriswidth, debrisheight, runnerx, runnery, canvaswidth, canvasheight, timeout;
function sizeset(){
  canvaswidth=window.innerWidth; canvasheight=window.innerHeight; runnerwidth=Math.ceil(canvaswidth/27);
  runnerheight=runnerwidth+10; debriswidth=debrisheight=Math.floor(canvaswidth/23);
}
window.addEventListener('resize', function(event){
  window.location.href=window.location.href;
})
sizeset();
function prestart(){
  
  runner=new item(canvaswidth/2, canvasheight-runnerheight*1.85, runnerwidth, runnerheight, '#FF0033');
  matrix.start();
  
}
function game(){ 
  matrix.welcome();
  timeout=setTimeout(prestart, 1000);
}
const matrix={
  level : document.createElement('p'),
  canvas : document.createElement('canvas'),
  welcome : function(){
    document.body.appendChild(this.level);
    this.level.innerHTML='LEVEL 1';
  },
  start : function(){
    this.level.remove();
    this.context=this.canvas.getContext('2d');
    this.canvas.width=canvaswidth; this.canvas.height=canvasheight;
    document.body.appendChild(this.canvas);
    this.count=-1; this.eleven=0; this.horiz=0; this.vert=0;
    this.key=[false, false, false, false]; this.time=[-1, -1, -1, -1];
    this.pause=false; this.savetime; this.stop=0;
    this.interval=setInterval(reset,20);
  }
}
function item(x, y, w, h, color){
  this.x=x; this.y=y; this.w=w; this.h=h; this.color=color;
  this.position=function(){
    matrix.context.beginPath();
    matrix.context.fillStyle=this.color;
    matrix.context.moveTo(this.x, this.y);
    matrix.context.lineTo(this.x-this.w/2, this.y+this.h);
    matrix.context.lineTo(this.x-this.w/2+this.w, this.y+this.h);
    matrix.context.closePath();
    matrix.context.fill();
  }
  this.falls=function(){
    matrix.context.beginPath();
    matrix.context.fillStyle=this.color;
    matrix.context.fillRect(this.x, this.y, this.w, this.h);
  }
}
function rand(v){
  let piece=Math.floor((canvaswidth-runnerwidth))/13;
  if(v==1) return Math.floor(Math.random()*piece)+2*piece;
  if(v==2) return Math.floor(Math.random()*piece)+10*piece;
  if(v==3) return Math.floor(Math.random()*piece)+5*piece;
  if(v==4) return Math.floor(Math.random()*piece)+7*piece;
  if(v==5) return Math.floor(Math.random()*piece)+piece;
  if(v==6) return Math.floor(Math.random()*piece)+11*piece;
  if(v==7) return Math.floor(Math.random()*piece)+4*piece;
  if(v==8) return Math.floor(Math.random()*piece)+8*piece;
  if(v==9) return Math.floor(Math.random()*piece);
  if(v==10) return Math.floor(Math.random()*piece)+12*piece;
  if(v==11) return Math.floor(Math.random()*piece)+3*piece;
  if(v==12) return Math.floor(Math.random()*piece)+9*piece;
  if(v==13) return Math.floor(Math.random()*piece)+6*piece;

}
function countdown(){
  const timer=document.getElementById('timer');
  let t=Math.floor(((6000-matrix.count)/50-Math.floor((6000-matrix.count)/3000)*60));
  timer.innerHTML=Math.floor((6000-matrix.count)/3000)+':'+(t<10 ? '0'+t : t);
  if(matrix.count>=6000)
    window.location.href='game3.html';
}
function reset(){
  if(check()){
   stop();
   while(restart()==false);
   return;
  }
  countdown();
  matrix.context.clearRect(0, 0, matrix.canvas.width, matrix.canvas.height);
  for(i=0; i<debris.length; i++){
    debris[i].y++;
    debris[i].falls();
  }
   if(++matrix.count%30==0){
     if(++matrix.eleven>13) matrix.eleven=1;
     debris.push(new item(rand(matrix.eleven), 0, debriswidth, debrisheight, '#99FF33'));
   }
   borders();
   runner.x+=matrix.horiz, runner.y+=matrix.vert;
   runner.position();
}
function borders(){
  if((matrix.horiz && runner.x+runner.w/2+matrix.horiz>matrix.canvas.width) ||
    (matrix.horiz<0 && runner.x-runner.w/2+matrix.horiz<0)) matrix.horiz=0;
  if((matrix.vert && runner.y+runner.h+matrix.vert>matrix.canvas.height) ||
    (matrix.vert<0 && runner.y+matrix.vert<0)) matrix.vert=0;
}
function stop(){
  clearInterval(matrix.interval);
  debris.push(new item(0, 0, matrix.canvas.width, matrix.canvas.height, 'rgba(100,100,100,0.5)'));
  debris[debris.length-1].falls();
  debris.push(new item(matrix.canvas.width/2-100, matrix.canvas.height/2-50, 200, 100, '#FFCC33'));
  debris[debris.length-1].falls();
  matrix.context.beginPath();
  matrix.context.font='small-caps 35px Tahoma';
  matrix.context.fillStyle='#FF0000';
  matrix.context.textAlign='center';
  matrix.context.textBaseline='middle';
  matrix.context.fillText('restart', matrix.canvas.width/2, matrix.canvas.height/2);
  debris.length=0; runner.x=canvaswidth/2; runner.y=canvasheight-runnerheight*1.85; matrix.count=-1; matrix.stop=1;
}
function restart(){
  matrix.canvas.addEventListener('click', function(event){
    let border=matrix.canvas.getBoundingClientRect();
    if(matrix.stop && event.clientX>matrix.canvas.width/2-100+border.x && event.clientX<matrix.canvas.width/2+100+border.x &&
      event.clientY>matrix.canvas.height/2-50+border.y && event.clientY<matrix.canvas.height/2+50+border.y){
      matrix.interval=setInterval(reset,20); matrix.stop=0;
      return true;
    }
    return false;
  })
}
function check(){
  let match=2*runner.h/runner.w;
  for(i=0; i<debris.length; i++){
    if(runner.x-runner.w/2>debris[i].x+debris[i].w || runner.x+runner.w/2<debris[i].x || 
      runner.y>debris[i].y+debris[i].h || runner.y+runner.h<debris[i].y) continue;
    let templ=(debris[i].x-runner.x)*match; let tempr=(runner.x-debris[i].x-debris[i].w)*match;
    if(debris[i].y+debris[i].h-runner.y<templ) continue;
    if(debris[i].y+debris[i].h-runner.y<tempr) continue;
    return true;
  }
  return false;
}
window.addEventListener('keydown', function(event){
  let x=1; let temp=0;
  if(matrix.key[event.keyCode-37]===false) temp=new Date().getTime();
  if((matrix.key[event.keyCode-37] && matrix.time[event.keyCode-37]==0) ||
    (matrix.key[event.keyCode-37]===false && temp-matrix.time[event.keyCode-37]<100)){
    x=5; matrix.time[event.keyCode-37]=0;
  }
  matrix.key[event.keyCode-37]=true;
  if(event.keyCode===37) matrix.horiz=-x;
  else if(event.keyCode===39) matrix.horiz=x;
  else if(event.keyCode===38) matrix.vert=-x;
  else if(event.keyCode===40) matrix.vert=x;
  if(matrix.time[event.keyCode-37] && temp-matrix.time[event.keyCode-37]>=100) matrix.time[event.keyCode-37]=-1;
})
window.addEventListener('keyup', function(event){
  matrix.time[event.keyCode-37]=new Date().getTime();
  matrix.key[event.keyCode-37]=false;
  if(event.keyCode===37 || event.keyCode===39) matrix.horiz=0;
  if(event.keyCode===38 || event.keyCode===40) matrix.vert=0;
})
function move(x){
  if(x===3) matrix.horiz=-1;
  else if(x===4) matrix.horiz=1;
  else if(x===1) matrix.vert=-1;
  else if(x===2) matrix.vert=1;
}
function cease(x){
  if(x===3) matrix.horiz=0;
  else if(x===4) matrix.horiz=0;
  else if(x===1) matrix.vert=0;
  else if(x===2) matrix.vert=0;
}
document.getElementById('timer').addEventListener('click', function(){
  if(matrix.pause){
    matrix.pause=false;
    debris.pop();
    matrix.interval=setInterval(reset,20);
    return;
  }
    clearInterval(matrix.interval);
    matrix.pause=true;
    debris.push(new item(0, 0, matrix.canvas.width, matrix.canvas.height, 'rgba(100,100,100,0.5)'));
    debris[debris.length-1].falls();
    return;
})