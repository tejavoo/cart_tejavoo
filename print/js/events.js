
//File Drag and Drop Animation
var drop = document.getElementById("fileDrop");
//var body = document.getElementById("bodyInViewer")
drop.addEventListener("dragover", changeDrop, false);
drop.addEventListener("dragleave",changeBackDrop, false);
//body.addEventListener("dragEnter", changeBackDrop2(), false);
drop.addEventListener("drop", changeBackDrop, false);

var counter = 0;
function changeDrop() {
  counter++;
  //drop.style.backgroundColor = '#eee'; 
  document.getElementById("beforeDrop").style.display = "none";
  document.getElementById("onDrag").style.display = "block";  

};

function changeBackDrop() {
  //drop.style.backgroundColor = '#0366A5';
  document.getElementById("beforeDrop").style.display = "block";
  document.getElementById("onDrag").style.display = "none";  
};


function changeBackDrop2() {
	if (counter == 1) {
	counter--;
  changeBackDrop();
  }
};

/*

function changeDrop() {
  counter++;
  drop.style.backgroundColor = '#eee'; 
  document.getElementById("beforeDrop").style.display = "none";
  document.getElementById("onDrag").style.display = "block";

};

function changeBackDrop() {
  drop.style.backgroundColor = '#0366A5';
  document.getElementById("beforeDrop").style.display = "block";
};

var counter = 0;
$('#fileDrop').bind({
                 dragenter: function(ev) {
                     counter++;
                     changeDrop();
                     ev.preventDefault();
                 },
                 
                 dragleave: function() {
                     counter--;
                     alert("Drag left");
                     if (counter === 0) { 
                        changeBackDrop();
                     }
                 }
                });
               */