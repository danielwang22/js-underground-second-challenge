var setTime = document.getElementById('setTime');
var prenum = document.getElementById('preNum');
var nextnum = document.getElementById('nextNum');
var btn = document.getElementById('temp');
var tryAgain = document.getElementById('tryAgain');
var oper = document.getElementById('oper');
var answer = document.getElementById('answer');
var score = document.getElementById('score');
var totalscore = document.getElementById('totalScore');

window._setInterval = window.setInterval;
window.setInterval = function(fun,time,...args){
    window._setIntervalQueue = window._setIntervalQueue || []
    var sid  =window._setInterval(fun,time,...args);
    window._setIntervalQueue.push(sid);
    return sid;
}

class secondchalleng{
    constructor(){
        this.oper = ['+','-','x','÷'];
        this.score = 0;
        this.started = false;
        prenum.innerText = Math.floor((Math.random() * 10) + 2)
        nextnum.innerText = Math.floor((Math.random() * 10) + 2)
    }
    set SetpreNum(val){ return this.preNum = Math.floor((Math.random() * val.range) + val.min)}
    get GetpreNum(){return this.preNum}
    set SetnextNum(val){ return this.nextNum = Math.floor((Math.random() * val.range) + val.min)}
    get GetnextNum(){return this.nextNum}
    get GetoperIndexNum(){ return (this.operIndex = Math.floor((Math.random() * 4))) }
    set Setsecond(val){ return this.second = this.second + val }
    get Getsecond(){ return this.second }
    set SetMesecond(val){ return this.mesecond = this.mesecond > 98 ? 0 : (this.mesecond + val)}
    get GetMesecond(){ return this.mesecond < 10 ? ('0' + this.mesecond):this.mesecond}
    start(){
        this.second = 0;
        this.mesecond = 0;
        this.started = true;
        this.setNumber();
        setInterval(()=>{
            this.Setsecond = 1;
        },1000)
        setInterval(()=>{
            this.SetMesecond = 1;
            setTime.textContent = `${this.Getsecond}:${this.GetMesecond}`;
            this.gameOver();
        },1)
    }
    gameOver(){
        if(this.Getsecond == 60){

            this.clearIntervalAll();

            $('html, body').animate({
                scrollTop: ($("#gameOver").offset().top) - 80
            }, 1000);

            this.started = false;

            return;
        }
    }
    clearIntervalAll(){
        while(window._setIntervalQueue.length){
            var sid = window._setIntervalQueue.shift();
            window.clearInterval(sid);
            console.log(sid);
        }
    }
    setNumber(){
        this.SetpreNum = {range:5,min:1};
        this.SetnextNum = {range:5,min:2};
        if(this.Getsecond<=20){
            this.SetpreNum = {range:10,min:1};
            this.SetnextNum = {range:10,min:2};
        }else if(this.Getsecond<=30){
            this.SetpreNum = {range:99,min:10};
            this.SetnextNum = {range:99,min:20};
        }else{
            this.SetpreNum = {range:900,min:100};
            this.SetnextNum = {range:900,min:110};
        }
        oper.innerText = this.oper[this.GetoperIndexNum]
        prenum.innerText = Math.max(this.GetpreNum,this.GetnextNum);
        nextnum.innerText = Math.min(this.GetpreNum,this.GetnextNum);
    }
    checkanswer(prenum,nextnum,oper,myanswer){
        if(this.started == false) {
            alert('請按開始鍵')
            return
        }else if(myanswer.length == 0){
            return
        }else{

        }
        let pre = parseFloat(prenum);
        let next = parseFloat(nextnum);
        let answer = parseFloat(myanswer)
        switch(oper){
            case '+':
                this.answer = pre + next;
                break;
            case '-':
                this.answer = pre - next;
                break;
            case 'x':
                this.answer = pre * next;
                break;
            case '÷':
                this.answer = pre / next;
                this.answer = this.answer.toFixed(1);
                break;
        }
        if(answer == this.answer){
            console.log('答對了');
            this.score += 1;
            console.log(this.score);
            score.innerText = `00${this.score}`;
        }else{
            console.log('錯誤');
            score.innerText = `00${this.score}`;
        }
        totalscore.innerText = this.score;
        this.setNumber();
    }
}


var game = new secondchalleng();
$('#startBtn').click(()=>{
    $('html, body').animate({
        scrollTop: ($("#play").offset().top) - 80
    }, 1000);
    if(game.started) return;
    setTimeout(()=>{
        game.start();
    },700)
});
btn.addEventListener('click',() =>{
    
},false);
tryAgain.addEventListener('click',() =>{
    $('html, body').animate({
        scrollTop: ($("html,body").offset().top)
    }, 1000);
    setTime.textContent = `00:00`;
    game.clearIntervalAll();
    game.started = false;
},false);
answer.addEventListener('keyup',(event) =>{
    if (event.key === "Enter") {
        game.checkanswer(prenum.innerText,nextnum.innerText,oper.innerText,answer.value);
        answer.value = '';
    }
},false)


