var startBtn = document.getElementById('startBtn');
    setTime = document.getElementById('setTime');
    prenum = document.getElementById('preNum');
    nextnum = document.getElementById('nextNum');
    btn = document.getElementById('temp');
    tryAgain = document.getElementById('tryAgain');
    oper = document.getElementById('oper');
    answer = document.getElementById('answer');
    score = document.getElementById('score');
    totalscore = document.getElementById('totalScore');
    billboard = document.querySelector('#billboard table');
    openBillboard = document.getElementById('openBillboard');
    yourScore = document.getElementById('yourscore');
//要來改寫setInterval
//先把原本的setInterval設定給我新的_setInterval
window._setInterval = window.setInterval;
window.setInterval = function(fun,time,...args){
    //用_setIntervalQueue 陣列來記錄每次執行函式的編號
    window._setIntervalQueue = window._setIntervalQueue || []
    //儲存執行_setInterval編號
    //再push到_setIntervalQueue陣列裡
    var sid = window._setInterval(fun,time,...args);
    window._setIntervalQueue.push(sid);
    return sid;
}

class secondchalleng{
    constructor(){
        this.oper = ['+','-','x','÷']; //所有運算符號
        this.score = 0; //原始分數
        this.started = false; //是否開始
        this.billboard = this.GetlocalStorage;
        if(this.GetlocalStorage.length != 0) this.initBillboard();
        prenum.innerText = Math.floor((Math.random() * 10) + 2) //未開始遊戲前的預設數字1
        nextnum.innerText = Math.floor((Math.random() * 10) + 2) //未開始遊戲前的預設數字2
    }
    //range控制範圍，min控制最小數字
    set SetpreNum(val){ return this.preNum = Math.floor((Math.random() * val.range) + val.min)}
    get GetpreNum(){return this.preNum}
    //range控制範圍，min控制最小數字
    set SetnextNum(val){ return this.nextNum = Math.floor((Math.random() * val.range) + val.min)}
    get GetnextNum(){return this.nextNum}
    //隨機1 ~ 4
    get GetoperIndexNum(){ return (this.operIndex = Math.floor((Math.random() * 4))) }
    //秒數
    set Setsecond(val){ return this.second = this.second + val }
    get Getsecond(){ return this.second }
    //毫秒數，到達99歸0
    //小於10自動前面補0
    set SetMesecond(val){ return this.mesecond = this.mesecond > 98 ? 0 : (this.mesecond + val)}
    get GetMesecond(){ return this.mesecond < 10 ? ('0' + this.mesecond):this.mesecond}
    //分數榜單
    set Setbillboard(data){ return this.billboard.push(data)}
    get Getbillboard(){ return this.billboard || []}
    //儲存資料到localStorage
    set SetlocalStorage(data) { return localStorage.setItem("YourScore",JSON.stringify(data)) }
    get GetlocalStorage() { return JSON.parse(localStorage.getItem("YourScore")) || [] }
    start(){
        //秒數、毫秒數預設為0
        this.second = 0;
        this.mesecond = 0;
        this.started = true;
        //產生題目
        this.setNumber();
        //每一秒加一，只到60S為止
        setInterval(()=>{
            this.Setsecond = 1;
        },1000)
        ////每一毫秒加一
        setInterval(()=>{
            this.SetMesecond = 1;
            setTime.textContent = `${this.Getsecond}:${this.GetMesecond}`;
            //60秒到即結束
            this.gameOver();
        },1)
    }
    gameOver(){
        if(this.Getsecond == 59){
            //停止計時器
            this.clearIntervalAll();
            //下滑到結算頁面
            $('html, body').animate({
                scrollTop: ($("#gameOver").offset().top)
            }, 1000);
            //結束
            this.started = false;

            this.addBillboard(this.score);

            return;
        }
    }
    clearIntervalAll(){
        //停止所有計時器
        while(window._setIntervalQueue.length){
            var sid = window._setIntervalQueue.shift();
            window.clearInterval(sid);
            console.log(sid);
        }
    }
    setNumber(){
        //開始遊戲後的數字
        //第一題
        this.SetpreNum = {range:5,min:1};
        this.SetnextNum = {range:5,min:2};
        //20秒以前，個位數題目
        if(this.Getsecond<=20){
            this.SetpreNum = {range:10,min:1};
            this.SetnextNum = {range:10,min:2};
        }
        //20秒之後，二位數題目
        else if(this.Getsecond<=30){
            this.SetpreNum = {range:99,min:10};
            this.SetnextNum = {range:99,min:20};
        }
        //30秒以後最難的三位數題目
        else{
            this.SetpreNum = {range:900,min:100};
            this.SetnextNum = {range:900,min:110};
        }
        //隨機產生符號
        oper.innerText = this.oper[this.GetoperIndexNum]
        //用MAX & MIN讓乘數永遠大於被乘數
        prenum.innerText = Math.max(this.GetpreNum,this.GetnextNum);
        nextnum.innerText = Math.min(this.GetpreNum,this.GetnextNum);
    }
    checkanswer(prenum,nextnum,oper,myanswer){
        //未按開始鍵時，不能遊戲
        if(this.started == false) {
            alert('請按開始鍵')
            return
        }
        //答案不能空白
        else if(myanswer.length == 0){
            return
        }else{

        }
        //字串轉數字
        let pre = parseFloat(prenum);
        let next = parseFloat(nextnum);
        let answer = parseFloat(myanswer)
        //運算符號
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
                //小數取到小數第一位，讓難度沒那麼難
                this.answer = this.answer.toFixed(1);
                break;
        }
        //答對了加1分
        if(answer == this.answer){
            console.log('答對了');
            this.score += 1;
            score.innerText = `00${this.score}`;
        }
        //答錯倒扣1分
        else{
            console.log('錯誤');
            this.score -= 1;
            //分數小數小於0不繼續倒扣
            score.innerText = this.score < 0 ? '000' : `00${this.score}`;
        }
        //總分
        totalscore.innerText = this.score;
        //繼續出題
        this.setNumber();
    }
    initBillboard(){
        this.GetlocalStorage.forEach(element => {
            //再table裡加入時間與分數
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            let td2 = document.createElement('td')

            td1.className = 'font-size-xxs text-center p-1';
            td2.className = 'font-size-xxs text-center p-1';

            td1.textContent = element.date;
            td2.textContent = element.yourscore;

            yourScore.appendChild(tr);
            tr.appendChild(td1);
            tr.appendChild(td2);
        });
    }
    addBillboard(score){
        //新增時間
        let d = new Date();
        let now = d.toLocaleDateString("en-US")

        //再table裡加入時間與分數
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')

        td1.className = 'font-size-xxs text-center p-1';
        td2.className = 'font-size-xxs text-center p-1';

        td1.textContent = now;
        td2.textContent = score;

        yourScore.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);

        this.Setbillboard = {
            date:now,
            yourscore:score
        }
        console.log(this.Getbillboard);
        this.SetlocalStorage = this.Getbillboard;
    }
}

//game實體
var game = new secondchalleng();
//開始鍵
startBtn.addEventListener('click',() =>{
    //下滑開始遊戲
    $('html, body').animate({
        scrollTop: ($("#play").offset().top)
    }, 1000);
    
    //遊戲開始後，開始鍵功能關閉
    if(game.started) return;

    //延遲700毫秒，等頁面下滑
    setTimeout(()=>{
        game.start();
    },700)
},false);
//重來鍵
tryAgain.addEventListener('click',() =>{
    //上滑到開始頁面
    $('html, body').animate({
        scrollTop: ($("html,body").offset().top)
    }, 1000);
    //歸零計時器，停止計時器
    setTime.textContent = `00:00`;
    game.clearIntervalAll();
    game.started = false;
},false);

//鍵盤輸入enter作答
answer.addEventListener('keyup',(event) =>{
    if (event.key === "Enter") {
        //帶入畫面上的所有數字和答案
        game.checkanswer(prenum.innerText,nextnum.innerText,oper.innerText,answer.value);
        //清空答案
        answer.value = '';
    }
},false);

//打開排行榜
var flag = true;
openBillboard.addEventListener('click',()=>{
    if(flag){
        billboard.classList.remove('d-none');
        flag = false;
    }else{
        billboard.classList.add('d-none');
        flag = true;
    }
},false)


