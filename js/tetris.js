window.$=HTMLElement.prototype.$=function(selector){
    return (this==window?document:this).querySelectorAll(selector);//
}
var tetris={
    RN : 20,  //界面的竖20行
    CN: 10,     //界面的横10列
    CSIZE:26,  //每个格子宽高都是26px
    interval:300,
    OFFSET_X:15,  //每个单元格左侧修正15px，边框的border
    OFFSET_Y:15,//每个单元格上方修正15px
    pg:null,  //保存游戏主界面
    currShape :null,//专门保存正在移动的图形对象
    nextShape :null,//专门保存下一个的图形对象
    wall:[],//保存所有停止下落的下方的方块
    overState:null,//判断结束时候的状态，第一行的处理，比较麻烦

    state:1,
    STATE_RUNNING:1,
    STATE_GAMEOVER:0,
    STATE_PAUSE:2,

    IMG_GAMEOVER:"img/game-over.png",
    IMG_PAUSE:"img/pause.png",

    SCORE:[0,1,3,5,8],
    init: function () {//初始化
        this.pg=$(".playground")[0];
        this.currShape=this.randomShape();
        this.nextShape=this.randomShape();
        //将wall数组初始化为RN个空数组对象
        for(var i=0;i<this.RN;this.wall[i++]=[]);
        this.paint();
        this.state=1;
        var lines =document.getElementById("lines");
        var score =document.getElementById("score");
        score.innerHTML=0;
        lines.innerHTML=0;

        this.timer=setInterval(function () {
            //调用tetris的drop方法//调用paint方法
            tetris.drop();tetris.paint();}
            ,this.interval);
        document.onkeydown=function () {

            var e =window.event||arguments[0];
            switch (e.keyCode){
                case 37:tetris.moveL();break;
                case 39:tetris.moveR();break;
                case 40:tetris.drop();break;
                case 38:tetris.rotateR();break;
                case 90:tetris.rotateL();break;

                case 80: tetris.pause();break;//暂停
                case 81: tetris.gameOver();break;//结束游戏
                case 67: tetris.myContinue();break;//暂停后，继续游戏
                case 83: //游戏结束后，重新开始
                    if(tetris.state==tetris.STATE_GAMEOVER){
                         tetris.init();
                    }
            }
        }
    },
    gameOver:function(){
        this.state=this.STATE_GAMEOVER;
        clearInterval(this.timer);
        this.timer=null;
        this.paint();
    },
    pause:function(){
        if(this.state==this.STATE_RUNNING){
            this.state=this.STATE_PAUSE;
        }
    },
    myContinue:function(){
        if(this.state==this.STATE_PAUSE){
            this.state=this.STATE_RUNNING;
        }
    },
    moveR:function () {
        if(this.state == this.STATE_RUNNING) {
            this.currShape.moveR();
            if (this.outOfBounds() || this.hit()) {
                this.currShape.moveL();
            }
        }
    },
    moveL:function () {
        if(this.state == this.STATE_RUNNING) {
            this.currShape.moveL();
            if (this.outOfBounds() || this.hit()) {
                this.currShape.moveR();
            }
        }
    },
    outOfBounds:function(){//检查当前图形是否越界
        //当前shape中任意一个单元格的col<0或>=CN
        var cells=this.currShape.cells;
        for(var i=0;i<cells.length;i++){
            if(cells[i].col<0||cells[i].col>=this.CN||cells[i].ROW>=0){
                return true;
            }
        }
        return false;
    },
    hit:function(){//检查当前图形是否碰撞
        //当前shape中任意一个单元格在wall中相同位置有格
        var cells=this.currShape.cells;

        try {
            for(var i=0;i<cells.length;i++){
                if(this.wall[cells[i].row][cells[i].col]){
                    return true;
                }
            }

       }
        catch (error){var a = cells[i];}

        return false;
    },
    isGameOver:function () {//判断当前游戏是否结束
        var cells = this.nextShape.cells;
        for(var i=0;i<cells.length;i++) {
            //nextshape中任意一个cell被wall中的cell占住了 就返回true
            if(this.wall[cells[i].row][cells[i].col]){
                this.state = this.STATE_GAMEOVER;
                 if(!this.wall[0][3]&&!this.wall[0][4]&&!this.wall[0][5]){//判断第一行是不是空的
                     for (var i = 0; i < cells.length; i++) {//遍历shape的四个cell
                         if (cells[i].row == 1) {  //把cell里面row=1，即本来应该放在第二行的
                             var temp = new Object();
                             temp.row = cells[i].row-1;
                             temp.col = cells[i].col;
                             temp.img = cells[i].img;
                             this.wall[cells[i].row-1][cells[i].col] = temp;
                         }
                     }   //第一行空出来，但是next是两行的shape，特殊处理
                 }
                return 1;
            }
        }
        return 0;
    },
    candrop:function () {
        //遍历currShape中的cells，只要发现任意的一个cell的row=RN-1，即到了19就不能走了
        //就返回false
        var cells = this.currShape.cells;
        for(var i=0;i<cells.length;i++) {

            if (cells[i].row == this.RN - 1) return false;
            //shape中任意一个下方有wall中的cell
            if(this.wall[cells[i].row+1][cells[i].col])return false;

        }
        return true;
    },
    randomShape:function () {
        switch (parseInt(Math.random()*7)){
            case 0: return new T();
            case 1: return new I();
            case 2: return new Z();
            case 3: return new J();
            case 4: return new L();
            case 5: return new S();
            case 6: return new O();
        }
    },
    rotateR:function () {
        if(this.state == this.STATE_RUNNING) {
            this.currShape.rotateR();
            if (this.outOfBounds() || this.hit())
                this.currShape.rotateL();
        }
    },
    rotateL:function () {
        if (this.state == this.STATE_RUNNING) {

        this.currShape.rotateL();
        if (this.outOfBounds() || this.hit())
            this.currShape.rotateR();
         }
    },
    paint:function () {//重绘所有格子，分数等的方法
        this.pg.innerHTML=this.pg.innerHTML.replace(
            /(<img(.*?)>)/g,"");//每次paint都把img格子全部删掉，再重绘当前和wall
        this.paintNextShape();
        this.paintShape();
        this.paintWall();
        this.paintState();

    },
    paintState:function () {
      var img = new Image();
      switch(this.state){
          case  this.STATE_GAMEOVER:
              img.src = this.IMG_GAMEOVER;
              break;
          case this.STATE_PAUSE:
              img.src = this.IMG_PAUSE;
              break;
          case this.STATE_RUNNING:
              break;
      }
      this.pg.appendChild(img);
    },

    drop:function () {  //这个绘制比较复杂，根据判断，能否掉落,并且掉落后放入wall数组。
        if(this.state == this.STATE_RUNNING) {
            if (this.candrop()) {
                this.currShape.drop();
            }
            else {
                this.landIntowall();  //把当前的shape放到了数组中，但是没有显示
                //消行
                var scoreLine = this.deletLines();
                //计分
                this.addScore(scoreLine);
                this.overState = this.isGameOver();
                if (!this.overState) {
                    this.currShape = this.nextShape;//把下一个放到游戏界面
                    this.nextShape = this.randomShape();//得到下一个
                } else if (this.overState) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        }
    },
    addScore:function (scoreLine) {
        var lines =document.getElementById("lines");
        var score =document.getElementById("score");
        lines.innerHTML= parseInt(lines.innerHTML) + scoreLine;
        score.innerHTML= parseInt(score.innerHTML) + this.SCORE[scoreLine];

    },
    deletLines:function() {
    //遍历wall中的每一行，检查有没有满的，删除当前行
        var lines = 0;
        for(var i=0;i<this.RN;i++){//从0往19判断，这个很重要
            if(this.isFull(i)){
                lines++;
                this.deletLine(i);
            }
        }
        //每删除一行，lines++，lines为本次遍历wall共删除的行数
        return lines;
    },
    deletLine:function (row) {//难点
        this.wall.splice(row,1);
        this.wall.unshift([]);
        for(var r=row;r>0;r--){//向上遍历
            for(var c=0;c<this.CN;c++){
                if(this.wall[r][c])
                this.wall[r][c].row++;//把每一格往下挪
            }
        }
    },
    isFull:function (row) {//判断指定行是否已满
        for(var i=0;i<this.CN;i++) {
            if (!this.wall[row][i])
                return false;
        }
        return true;

    },
    paintWall:function () {//负责把落地的shape，即放到wall中的，打印到html
        var walls = this.wall;
        for (var i = 0; i < this.RN; i++) {
            for(var j=0;j<this.CN;j++){
                if(walls[i][j]){
                img1 = new Image();
                img1.src = walls[i][j].img;
                img1.style.left = walls[i][j].col * this.CSIZE + this.OFFSET_X + 'px';
                img1.style.top = walls[i][j].row * this.CSIZE + this.OFFSET_Y + 'px';
                this.pg.appendChild(img1);
                }
            }
        }
    },
    paintNextShape:function () {
        var cells = this.nextShape.cells;
        for(var i=0;i<cells.length;i++){
            img1 = new Image();
            img1.src = cells[i].img;
            img1.style.left = (cells[i].col+10)*this.CSIZE+this.OFFSET_X+'px';
            img1.style.top = (cells[i].row+1)*this.CSIZE+this.OFFSET_Y+'px';
            this.pg.appendChild(img1);
        }
    },
    paintShape:function () {//专门绘制当前图形的方法，从上面掉下来的图案
            //遍历currShape中cells数组中的每个cell
        //计算当前的坐标:cell的col*CSIZE+OFFSET_X,row*CSIZE+OFFSET_Y
        //创建一个img对象
        //设置img对象的scr=cell的img属性，left和top
        var cells = this.currShape.cells;
        for(var i=0;i<cells.length;i++){
        img1 = new Image();
        img1.src = cells[i].img;
        img1.style.left = cells[i].col*this.CSIZE+this.OFFSET_X+'px';
        img1.style.top = cells[i].row*this.CSIZE+this.OFFSET_Y+'px';
        this.pg.appendChild(img1);
        }

    },
    landIntowall:function () {
        //遍历当前图形中的每个cell，每遍历一个cell，
        //就将cell放入wall中相同row，col的位置
        var cells = this.currShape.cells;
        for(var i=0;i<cells.length;i++){
            this.wall[cells[i].row][cells[i].col] = cells[i];
        }
    }

}
window.onload=function () {
    tetris.init();
}
