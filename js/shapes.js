function Cell(row,col,img) {
    this.row = row;
    this.col = col;
    this.img = img;
    if(!Cell.prototype.drop){
        Cell.prototype.drop=function () {
            this.row++;
        }
    }
    if(!Cell.prototype.moveR){
        Cell.prototype.moveR=function(){
            this.col++;
        }
    }
    if(!Cell.prototype.moveL){
        Cell.prototype.moveL=function(){
            this.col--;
        }
    }
}
function State(r0,c0,r1,c1,r2,c2,r3,c3) {
    //第0个cell相对于参照cell的下标偏移量
    this.r0=r0;
    this.c0=c0;
    //第1个cell相对于参照cell的下标偏移量
    this.r1=r1;
    this.c1=c1;
    //第2个cell相对于参照cell的下标偏移量
    this.r2=r2;
    this.c2=c2;
    //第3个cell相对于参照cell的下标偏移量
    this.r3=r3;
    this.c3=c3;
}
function Shape(img,orgi) {
    this.img = img;
    this.orgi = orgi;
    this.states=[];
    this.statei=0;
    if(!Shape.prototype.drop){
        Shape.prototype.drop=function () {
            for(var i=0;i<this.cells.length;i++){
                this.cells[i].row++; //图像的drop就是每个cell都drop，
            }                           // this.cells就是 O的cells，因为是O来调用这个函数
        }
    }

    if(!Shape.prototype.moveR){
        Shape.prototype.moveR=function(){
            //遍历当前对象的cells中的每个cell对象
            for(var i=0;i<this.cells.length;i++){
                //    调用当前cell对象的drop方法
                this.cells[i].moveR();
            }
        }
    }
    if(!Shape.prototype.moveL){
        Shape.prototype.moveL=function(){
            //遍历当前对象的cells中的每个cell对象
            for(var i=0;i<this.cells.length;i++){
                //    调用当前cell对象的drop方法
                this.cells[i].moveL();
            }
        }
    }

    if(!Shape.prototype.rotateR){
        Shape.prototype.rotateR=function () {
            if(this.constructor!=O){
                this.statei++;
                this.statei>=this.states.length &&(this.statei = 0);
                var state = this.states[this.statei];
                var orgr = this.cells[this.orgi].row;
                var orgc = this.cells[this.orgi].col;
                for(var i=0 ; i<4;i++){
                    this.cells[i].row = orgr +state["r"+i];
                    this.cells[i].col = orgc +state["c"+i];

                }
                for(var i=0 ; i<4;i++){
                    if(this.cells[i].row<0)
                        for(var j=0 ; j<4;j++){
                            this.cells[j].row = orgr -state["r"+j];
                            this.cells[j].col = orgc -state["c"+j];
                        }
                }
            }
            }
        }
    }
    if(!Shape.prototype.rotateL){
        Shape.prototype.rotateL=function () {
            if(this.constructor!=O){
                this.statei--;
                this.statei<0 &&(this.statei = this.states.length-1);
                var state = this.states[this.statei];
                var orgr = this.cells[this.orgi].row;
                var orgc = this.cells[this.orgi].col;
                for(var i=0 ; i<4;i++){
                    this.cells[i].row = orgr +state["r"+i];
                    this.cells[i].col = orgc +state["c"+i];
                }
                var temp = new Object();
                for(var i=0 ; i<4;i++){
                    temp[i].row = cells[i].row;
                    temp[i].col = cells[i].col;
                    temp[i].img = cells[i].img;
                }
                for(var i=0 ; i<4;i++){
                    if(this.cells[i].row<0)
                        for(var j=0 ; j<4;j++){
                            this.cells[j] = temp[j];
                            t
                    }
                }
            }
        }

    }


function O() { // 04 05 14 15
    Shape.call(this,"img/O.png");
    if(!Shape.prototype.isPrototypeOf(O.prototype)){
        Object.setPrototypeOf(O.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,4,this.img), new Cell(0,5,this.img),
        new Cell(1,4,this.img), new Cell(1,5,this.img)
    ];
}

function T() { //03 04 05 14
    Shape.call(this,"img/T.png",1);
    if(!Shape.prototype.isPrototypeOf(T.prototype)){
        Object.setPrototypeOf(T.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,3,this.img), new Cell(0,4,this.img),
        new Cell(0,5,this.img), new Cell(1,4,this.img)
    ];
    this.states[0]=new State(0,-1, 0,0, 0,1, 1,0);
    this.states[1]=new State(-1,0, 0,0, 1,0, 0,-1);
    this.states[2]=new State(0,1,  0,0, 0,-1, -1,0);
    this.states[3]=new State(1,0,  0,0, -1,0, 0,1);
}
function I() { //03 04 05 06
    Shape.call(this,"img/I.png",1);
    if(!Shape.prototype.isPrototypeOf(I.prototype)){
        Object.setPrototypeOf(I.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,3,this.img), new Cell(0,4,this.img),
        new Cell(0,5,this.img), new Cell(0,6,this.img)
    ];
    this.states[0] = new State(0,-1,  0,0,  0,1,  0,2);
    this.states[1] = new State(-1,0, 0,0,  1,0, 2,0);
}
function S() { //04 05 13 14
    Shape.call(this,"img/S.png",3);
    if(!Shape.prototype.isPrototypeOf(S.prototype)){
        Object.setPrototypeOf(S.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,4,this.img), new Cell(1,3,this.img),
        new Cell(1,4,this.img), new Cell(0,5,this.img)
    ];
    this.states[0]=new State(-1,0, -1,1, 0,-1, 0,0);
    this.states[1]=new State(0,1, 1,1, -1,0, 0,0);
}
function Z() { //03 04 15 14
    Shape.call(this,"img/Z.png",2);
    if(!Shape.prototype.isPrototypeOf(Z.prototype)){
        Object.setPrototypeOf(Z.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,3,this.img), new Cell(1,5,this.img),
        new Cell(1,4,this.img), new Cell(0,4,this.img)
    ];
}
function L() { //04 03 05 13
    Shape.call(this,"img/L.png",1);
    if(!Shape.prototype.isPrototypeOf(L.prototype)){
        Object.setPrototypeOf(L.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,4,this.img), new Cell(0,3,this.img),
        new Cell(1,3,this.img), new Cell(0,5,this.img)
    ];
}
function J() { //04 03 05 15
    Shape.call(this,"img/J.png",1);
    if(!Shape.prototype.isPrototypeOf(J.prototype)){
        Object.setPrototypeOf(J.prototype,Shape.prototype);
    }
    this.cells=[
        new Cell(0,4,this.img), new Cell(0,3,this.img),
        new Cell(1,5,this.img), new Cell(0,5,this.img)
    ];
}