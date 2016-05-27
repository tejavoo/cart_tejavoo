function FormHelper() {
 this.data = "";
 
 this.append = function(name, val) {
   if (this.data.length > 0) {
     this.data += "&";
   }
   this.data += encodeURIComponent(name);
   this.data += "=";
   this.data += encodeURIComponent(val);
 }
}

function loginCheck($localStorage) {
    if ($localStorage.pk == null) {
      window.location = "index.html?next="+window.location.href;
    }
}

function mainAppCheck($localStorage) {
    if ($localStorage.pk != null) {
      window.location = "mainApp.html?rel=m13";
      
    }
}
  
document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}



function animateValue(classVal, start, end, duration) {
    // assumes integer values for start and end
    
    //var obj = document.getElementById(id);
    var obj = document.getElementsByClassName(classVal)[0];
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 100;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));
    
    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);
    
    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;
  
    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value;
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

app.controller('footerCtrl', function($scope) {
  $scope.showFeedback = true; 
  //=true
});