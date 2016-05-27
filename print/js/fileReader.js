//@Author :madhu131313
if(window.FileReader) { 
 var drop; 
 addEventHandler(window, 'load', function() {
    
    drop   = document.getElementById('fileDrop');
    
  	
    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }
  
    // Tells the browser that we *can* drop on this target
    addEventHandler(drop, 'dragover', cancel);
    addEventHandler(drop, 'dragenter', cancel);
    //drop.ondragover = function () { this.className = 'hoverDrop'; return false; };
     //drop.ondragend = function () { this.className = ''; return false; };

addEventHandler(drop, 'drop', function (e) {
  e = e || window.event; // get window.event if e argument missing (in IE)   
  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

  var dt    = e.dataTransfer;
  var files = dt.files;
  for (var i=0; i<files.length; i++) {
    var file = files[i];
    
    var pdfType = "pdf";
      if (file.type.match(pdfType)) {
          // Read the local file into a Uint8Array.
    var fileReader = new FileReader();
    fileReader.onload = function webViewerChangeFileReaderOnload(evt) {
      var buffer = evt.target.result;
      var uint8Array = new Uint8Array(buffer);
      PDFViewerApplication.open(uint8Array, 0);
    };
    fileReader.readAsArrayBuffer(file);
    docSource = "drop"; //drop, uploadButton, shared
    document.getElementById('container').style.display = 'none';
    document.getElementById('PDFMain').style.display = 'block';
    //sendFile();
    angular.element(document.querySelector('[ng-controller="loadingCtrl"]')).scope().docRendering  = true;                  
    angular.element(document.querySelector('[ng-controller="PDFCtrl"]')).scope().sendFile(file, true);
    errorFileCheck(file.size);
    angular.element(document.querySelector('[ng-controller="PDFCtrl"]')).scope().setSelfUpload();    
    //window.location.hash = 'pdf';
    


      } else {
        alert("Please drop only PDF document :)");
      }
  }
  return false;
});
Function.prototype.bindToEventHandler = function bindToEventHandler() {
  var handler = this;
  var boundParameters = Array.prototype.slice.call(arguments);
  //create closure
  return function(e) {
      e = e || window.event; // get window.event if e argument missing (in IE)   
      boundParameters.unshift(e);
      handler.apply(this, boundParameters);
  }
};
  });
} else { 
  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}
function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}