/* global $ */
/* global localStorage */

$(document).ready(function () {

  /**
   * ----------- Nav bar------------
   **/
  
  var navContainer = $("#nav-container");
  var navWidth = navContainer.width();
  if (mobile) {
    navContainer.css("right", -navWidth);
  } else {
    navContainer.css("right", 0);
  }
  
  $("#nav-button, #sticker-nav-button").click(function() {
    navContainer.animate({
      right: 0
    });
  });
  
  $("#nav-button-close").click(function() {
    navContainer.animate({
      right: -navWidth
    });
  });
  
  $("#nav-play, #start-over").click(function() { 
    window.location = '/';
  });
  
  $("#nav-instructions").click(function() {
    clearCache(function() {
      window.location = '/';
    });
  });
  
  $("#nav-store").click(function() {
    window.location = 'https://www.greycork.com';
  });
  
  $("#nav-okgrl").click(function() {
    window.location = 'https://www.okgrl.com';
  });
  
  $("#nav-privacy").click(function() {
    window.location = '/privacy';
  });
   
});
   
function clearCache(cb) {
  localStorage.setItem("completedTutorial", "false");
  localStorage.setItem("skippedTutorial", "false");
  cb();
}

function isCanvasBlank(canvas) {
  var blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;

  return canvas.toDataURL() == blank.toDataURL();
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}