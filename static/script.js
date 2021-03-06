const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");

var date = new Date();
// console.log(date);

let hr = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();
// console.log("Hour: " + hr + " Minute: " + min + " Second: " + sec);

let hrPosition = (hr*360/12)+(min*(360/60)/12);
let minPosition = (min*360/60)+(sec*(360/60)/60);
let secPosition = sec*360/60;

function runTheclock(){

    hrPosition = hrPosition + (3/360);
    minPosition = minPosition + (6/60);
    secPosition = secPosition + 6;

    HOURHAND.style.transform = "rotate(" + hrPosition + "deg)";
    MINUTEHAND.style.transform = "rotate(" + minPosition + "deg)";
    //SECONDHAND.style.transform = "rotate(" + secPosition + "deg)";


}

//var interval = setInterval(runTheclock,1000);
runTheclock();
/*Digital clock part*/
function showTime(){
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var session = "AM";

    if(hr == 0){
        hr = 12;
    }
    if(hr > 12){
        hr = hr - 12;
        session = "PM";

    }

    hr = (hr < 10) ? "0" + hr : hr;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;
    var time = hr + ":" + min + ":" + sec + " " + session;
    document.getElementById("digitalClock").innerText = time;
    document.getElementById("digitalClock").textContent = time;

    document.getElementById("date").innerText = date;
    document.getElementById("date").textContent = date;

    //setTimeout(showTime,1000);


};

function check(){
  var date = new Date();
  var hr = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var btn = document.getElementById("btn");
  var inp = document.getElementById("ans");
    var time1 = document.getElementById("time").value;
    var time2 = document.getElementById("time2").value;
    if(hr > 12){
        hr = hr - 12;
    }
    console.log(hr+"  " + min +"  "+time1+ "  "+ time2);
    if(time1 != hr){
      document.getElementById("comment").innerText = "Incorrect Time!";
      inp.value = 0;
    }
    else if(time2 != min && time2 != min-1 && time2 != min+1){
      document.getElementById("comment").innerText = "Incorrect Time!";
      inp.value = 0;
    }
    else {
      document.getElementById("comment").innerText = "Correct Time!";
      inp.value = 1;
    }
    btn.click();
    console.log(time);
};

showTime();
