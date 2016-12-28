/* globals $ */
/* globals loadImage */
/* globals mobile */
   
var CAMERA_ID = 'camera';
var CAMERA_BUTTON_ID = 'camera-button';
var SAVE_BUTTON_ID = 'save-button';
var STICKER_BUTTON_ID = 'sticker-button';
var REMOVE_STICKER_BUTTON_ID = 'remove-sticker-button';

var EDITOR_CONTAINER_ID = 'editor-middle';
var CANVAS_ID = 'canvas';
var SAVED_IMAGE_ID = 'saved-img';
var TRASH_BUTTON_ID = 'trash-button';
var CAMERA_ICON_ID = 'camera-icon';

var STICKER_MENU_ID = 'sticker-menu';
var STICKER_MENU_BACK_ID = 'sticker-menu-bar-back';
var STICKER_MENU_STICKERS_ID = 'sticker-menu-stickers';
var STICKER_ICON_CLASS = 'sticker-icon';

var DOWNLOAD_OVERLAY_ID = 'download-overlay';
var DOWNLOAD_BUTTON_ID = 'download-overlay-ok-button';
var DOWNLOAD_BACK_BUTTON_ID = 'download-overlay-menu-bar-back';
var DOWNLOAD_IMAGE_URL_ID = 'download-image-url';

var SHARE_CHECKBOX_ID = 'share-download';

var PROMOCODE_CONTAINER_ID = 'promocode-container';

var INSTRUCTIONS_CONTAINER_ID = 'instructions-container';

var NOTIFICATION_ID = 'notification';
var NOTIFICATION_CONTENT_ID = 'notification-content';
var NOTIFICATION_CONFIRM_ID = 'notification-confirm';
var NOTIFICATION_ALERT_ID = 'notification-alert';
var NOTIFICATION_ALERT_OK_BUTTON_ID = 'notification-alert-ok';
var NOTIFICATION_CONFIRM_OK_BUTTON_ID = 'notification-confirm-ok';
var NOTIFICATION_CONFIRM_CANCEL_BUTTON_ID = 'notification-confirm-cancel';

var SIZE_MULTIPLIER = 2; // how much to scale the downloaded/saved image 
var stickerStack = []; // stack of active stickers
var storedFileId = ''; // storedFileId

$(document).ready(function() {

  /**
   * Take picture / Upload picture and put picture in the background canvas
   **/
   
  var editor = $("#"+EDITOR_CONTAINER_ID);
  var camera = document.getElementById(CAMERA_ID);
  
  camera.addEventListener('change', function(e) {
    var file = e.target.files[0]; 
    var fileName = file.name;
    
    // trick to make sure element is fired even when same file is selected
    $("#"+CAMERA_ID).val("");
    
    loadImage.parseMetaData(file, function(data) {
      var options = { 
        canvas: true, 
        maxWidth: editor.width() * SIZE_MULTIPLIER,
        minWidth: editor.width() * SIZE_MULTIPLIER,
        maxHeight: editor.height() * SIZE_MULTIPLIER,
        minHeight: editor.height() * SIZE_MULTIPLIER 
      };  
      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }
      loadImage(file, function(tempCanvas) {
        
        // send file to server so that this raw image can be stored
        var data = tempCanvas.toDataURL('image/png');
        var d = new Date();
        
        // fileId: raw-mm/dd/yyyy-time-<fileName>
        var fileId = d.getMonth() + "" +
                     d.getDate() + "" +
                     d.getYear() + "-" + 
                     d.getTime() + "-" + fileName;
                     
        storedFileId = fileId;
        $.post("/raw-image", { image: data, fileId: storedFileId }, function(data) {});
        
        /**
         * We need to draw the resulting canvas (tempCanvas) into
         * our canvas object, instead of just adding the tempCanvas
         * to the page because the tempCanvas has exif meta data
         * attached to it, complicating rotations...
         * By drawing the tempCanvas into our canvas element, we
         * flatten the image thereby mitigating rotation complexities
         **/
         
        var canvas = document.getElementById(CANVAS_ID);
        
        // set width - reduce width on desktop if its a wide image
        if (!mobile) {
          canvas.width = tempCanvas.width > 1.5 * tempCanvas.height ? 
            tempCanvas.width - 100 : tempCanvas.width;
        } else {
          canvas.width = tempCanvas.width;
        }
        
        // set height 
        canvas.height = tempCanvas.height;
        
        var ctx = canvas.getContext('2d');
        ctx.drawImage(tempCanvas, 0, 0);
        $(canvas).css("width", ($(canvas).width() / SIZE_MULTIPLIER) + "px");
        
        // image offsets to keep canvas centered
        $(canvas).css("left", "50%");
        $(canvas).css("top", "50%");
        $(canvas).css("transform", "translateX(-50%) translateY(-50%)");
        
        // canvas is ready!
        $(window).trigger("uploadImage", [ /* param1, param2 */]);
      }, options);
    });
  });
  
  /**
   * Generate sticker menu from stickers in images/stickers/ directory
   **/
    
  var stickerPaths = [
    "/images/stickers/additional-coffeepot-0.png",
    "/images/stickers/additional-greycorkbowl-0.png",
    "/images/stickers/additional-plant-0.png",
    "/images/stickers/bookshelfshort-0.png",
    "/images/stickers/bookshelftall-0.png",
    "/images/stickers/bookshelftall-1.png",
    "/images/stickers/chaise-0.png",
    "/images/stickers/chaise-1.png",
    "/images/stickers/coffeetable-0.png",
    "/images/stickers/coffeetable-1.png",
    "/images/stickers/sectional-0.png",
    "/images/stickers/sidetable-0.png",
    "/images/stickers/sofa-0.png",
    "/images/stickers/sofa-1.png",
    "/images/stickers/sofa-2.png",
    "/images/stickers/sofa-3.png"
  ];
  var stickersContainer = $("#"+STICKER_MENU_STICKERS_ID);
  
  var columns = [];
  for (var i=0; i < stickerPaths.length; i++) {
    
    var stickerPath = stickerPaths[i];      
    var imgElement = $("<img class='sticker-icon' src='"+stickerPath+"'/>");
    var colElement = $("<div class='col-xs-6 sticker-menu-col'></div>");
    colElement.append(imgElement);
    columns.push(colElement);
    
    if (i % 2 != 0 || i == stickerPaths.length - 1) {
      var rowElement = $("<div class='row sticker-menu-row'></div>");
      for (var j in columns) {
        rowElement.append(columns[j]);
      }
      stickersContainer.append(rowElement);
      columns = [];
    }
  }
  
  /**
   * Handle events if not mobile 
   **/
  if (!mobile) {
    $(window).trigger("showStickerMenu");
  } 
   
});

/**
 * EVENT: 'uploadImage'
 **/ 
$(window).on("uploadImage", function(e, p1, p2) {
  // update buttons
  $("#"+SAVE_BUTTON_ID).addClass("active"); // show save button
  $("#"+TRASH_BUTTON_ID).addClass("active"); // show trash icon
  $("#"+CAMERA_BUTTON_ID).removeClass("active"); // hide camera icon
  $("#"+INSTRUCTIONS_CONTAINER_ID).removeClass("active"); // show sticker button
  if (mobile) {
    $("#"+STICKER_BUTTON_ID).addClass("active"); // show sticker button
  } else {
    $("#"+REMOVE_STICKER_BUTTON_ID).addClass("active"); // show reset button on desktop only
  }
  
  if (mobile) {
    
    // Sticker Button on click (mobile only)
    $("#"+TRASH_BUTTON_ID).off('click');
    $("#"+STICKER_BUTTON_ID).click(function() {
      $(window).trigger("showStickerMenu", [ /* param1, param2 */]);
    });
    
  } else {
    
    // Reset Stickers button on click (desktop only)
    $("#"+REMOVE_STICKER_BUTTON_ID).off('click');
    $("#"+REMOVE_STICKER_BUTTON_ID).click(function() {
      $(window).trigger("removeSticker", []);
    });
    
  }
  
  // Save Button on click
  $("#"+TRASH_BUTTON_ID).off('click');
  $("#"+SAVE_BUTTON_ID).click(function() {
    $(window).trigger("openDownloadOverlay");
  });
  
  // Trash Button on click
  $("#"+TRASH_BUTTON_ID).off('click');
  $("#"+TRASH_BUTTON_ID).click(function() {
    if (mobile) {
      if (confirm("Are you sure you want to discard your image and start again?")) {
        $(window).trigger("deleteImage");  
      }
    } else {
      var msg = "Are you sure you want to discard your image and start again?";
      $(window).trigger("notification", [ 
        msg, 
        true, 
        function(){
          $(window).trigger("deleteImage");  
        }
      ]);
    }
  });
 
});

/**
 * EVENT: 'removeSticker'
 **/
$(window).on("removeSticker", function(e, p1, p2) {
  if (stickerStack.length == 0) {
    var msg = "The remove-sticker button won't work if there are no stickers! Start by adding stickers from the panel on the left.";
    $(window).trigger("notification", [ msg, false, null ]);
  } else {
    stickerStack.pop();
    $(".sticker:last").remove();
  }
  
});

/**
 * EVENT: 'showStickerMenu'
 **/
$(window).on("showStickerMenu", function(e, p1, p2) {
  if (mobile) {
    $("#"+STICKER_MENU_ID).slideDown(function() {
      
      $("#"+STICKER_MENU_ID).addClass("active");
      
      $("#"+STICKER_MENU_BACK_ID).click(function() {
        $("#"+STICKER_MENU_ID).slideUp(function() {
          $("#"+STICKER_MENU_ID).removeClass("active");
        });
      });
      
      $("."+STICKER_ICON_CLASS).each(function() {
        $(this).unbind('click');
        $(this).one('click', function(){
          // add new sticker to canvas
          var path = $(this).attr("src");
          stickerStack.push(new Sticker(path, "#"+EDITOR_CONTAINER_ID));
          
          // hide sticker menu
          $("#"+STICKER_MENU_ID).slideUp(function() {
            $("#"+STICKER_MENU_ID).removeClass("active");
          });
        });
      });
      
    });
  } else {
    $("."+STICKER_ICON_CLASS).each(function() {
      //$(this).unbind('click');
      $(this).on('click', function(){
        if (isCanvasBlank(document.getElementById(CANVAS_ID))) {
          var msg = "You need to upload an image before you can add stickers!";
          $(window).trigger("notification", [ msg, false, null ]);     
        } else {
          // add new sticker to canvas
          var path = $(this).attr("src");
          stickerStack.push(new Sticker(path, "#"+EDITOR_CONTAINER_ID));
        }
      });
    });
  }
});

/**
 * EVENT: 'saveImage'
 **/
$(window).on("saveImage", function(e) {
  var destinationCanvas = document.getElementById(CANVAS_ID);
  var destinationCtx = destinationCanvas.getContext('2d');
  destinationCtx.globalCompositeOperation = 'source-atop';
  
  // flatten canvases
  for (var i in stickerStack) {
     
    var imgCanvas = stickerStack[i].getSticker();
    var imgCanvasPos = stickerStack[i].getPosition();
    var imgCanvasRotation = stickerStack[i].getRotation();
    var imgCanvasScale = stickerStack[i].getScale();
           
    destinationCtx.save();

    // set position / scale
    destinationCtx.scale(SIZE_MULTIPLIER, SIZE_MULTIPLIER);
    destinationCtx.translate(imgCanvasPos.left, imgCanvasPos.top);

    // sticker offsets to take into account that canvas is centered
    var offsetTop = $(destinationCanvas).offset().top - $("#"+EDITOR_CONTAINER_ID).offset().top;
    var offsetLeft = $(destinationCanvas).offset().left - $("#"+EDITOR_CONTAINER_ID).offset().left;
    destinationCtx.translate(-offsetLeft, -offsetTop);

    // set rotation/scale
    destinationCtx.translate(imgCanvas.width/2, imgCanvas.height/2);
    destinationCtx.rotate(imgCanvasRotation * Math.PI/180);
    destinationCtx.scale(imgCanvasScale, imgCanvasScale);
    destinationCtx.translate(-imgCanvas.width/2, -imgCanvas.height/2)
    
    // draw image
    destinationCtx.drawImage(imgCanvas, 0, 0);
    
    destinationCtx.restore();
    
    // hide sticker after flattening
    $(stickerStack[i].getSticker()).hide();
  }
  
  // convert to image
  var dataURL = destinationCanvas.toDataURL('image/png');  
  $(destinationCanvas).css("display", "none");
  var img = document.getElementById(SAVED_IMAGE_ID);
  img.src = dataURL;
  $(img).css("width", $(destinationCanvas).width());
  $(img).css("height", $(destinationCanvas).height());
  
  // create link to download image for desktop version
  if (!mobile) {
    destinationCanvas.toBlob(function(blob) {
      var a = document.getElementById(DOWNLOAD_IMAGE_URL_ID);
      a.href = window.URL.createObjectURL(blob);
      a.download = "try-greycork.jpg";
    }, "image/jpeg", 0.7);
  }
  
  // center saved image
  $(img).css("position", "absolute");
  $(img).css("left", "50%");
  $(img).css("top", "50%");
  $(img).css("transform", "translateX(-50%) translateY(-50%)");
  
  $("#"+EDITOR_CONTAINER_ID).append(img);
  $("#"+SAVE_BUTTON_ID).off();
  
  // send original image, stickers and final image to the server
  $.post("/edited-image", 
    { image: dataURL, fileId: storedFileId }, 
    function() {});
  
  // reset canvas
  var canvas = document.getElementById(CANVAS_ID);
  $(canvas).css("width", "100vw");
  $(canvas).remove();
  $("#"+EDITOR_CONTAINER_ID).append($("<canvas id='canvas'></canvas>"));
  
  // empty sticker stack and delete each sticker
  for (var i in stickerStack) {
    stickerStack[i].deleteSticker(); 
  }
  stickerStack = [];
  
});

/**
 * EVENT: 'deleteImage'
 **/ 
$(window).on("deleteImage", function(e, p1, p2) {
  
  // reset canvas
  var canvas = document.getElementById(CANVAS_ID);
  $(canvas).css("width", "100vw");
  $(canvas).remove();
  $("#"+EDITOR_CONTAINER_ID).append($("<canvas id='canvas'></canvas>"));
  
  // empty sticker stack and delete each sticker
  for (var i in stickerStack) {
    stickerStack[i].deleteSticker(); 
  }
  stickerStack = [];
  
  // hide sticker-menu-button, trash-button and save-button, but show camera-button $("#"+SAVE_BUTTON_ID).removeClass("active"); // show save button $("#"+TRASH_BUTTON_ID).removeClass("active"); // show trash icon
  $("#"+CAMERA_BUTTON_ID).addClass("active"); // hide camera icon
  $("#"+STICKER_BUTTON_ID).removeClass("active"); // show sticker button
  $("#"+REMOVE_STICKER_BUTTON_ID).removeClass("active"); // hide reset button on desktop only
  $("#"+INSTRUCTIONS_CONTAINER_ID).addClass("active"); // show sticker button
  $("#"+SAVE_BUTTON_ID).removeClass('active'); // hide download button
 
});

/**
 * EVENT: 'openDownloadOverlay'
 **/ 
$(window).on('openDownloadOverlay', function(e, p1, p2) {
  if (mobile) {
    $("#"+DOWNLOAD_OVERLAY_ID).slideDown(function() {
      $("#"+DOWNLOAD_OVERLAY_ID).addClass('active');
    });
    
    var isChecked = $("#"+SHARE_CHECKBOX_ID).is(":checked");
    
    // download the image!
    $("#"+DOWNLOAD_BUTTON_ID).off('click');
    $("#"+DOWNLOAD_BUTTON_ID).click(function() {
      if (isChecked) {
        // send image off to server...
        // TODO
      }      
      $(window).trigger("saveImage");
      $(window).trigger("closeDownloadOverlay");
    });
    
    // clicked on back button
    $("#"+DOWNLOAD_BACK_BUTTON_ID).off('click');
    $("#"+DOWNLOAD_BACK_BUTTON_ID).click(function() {
      
      $("#"+DOWNLOAD_BUTTON_ID).unbind('click');
      
      $("#"+DOWNLOAD_OVERLAY_ID).slideUp(function() {
        $("#"+DOWNLOAD_OVERLAY_ID).removeClass('active');
      });
      
    });
  } else {
    var msg = "Once you choose to download your image, you can't go back to edit it. Are you sure ready to save your image?";
    $(window).trigger("notification", [ msg, true, function() {
      // download
      $(window).trigger("saveImage");
      $(window).trigger("closeDownloadOverlay");
    }]);     
  }
  
});

/**
 * EVENT: 'closeDownloadOverlay'
 **/ 
$(window).on('closeDownloadOverlay', function(e, p1, p2) {
  // hide all buttons in editor
  $("#"+SAVE_BUTTON_ID).removeClass("active"); // hide save button
  $("#"+TRASH_BUTTON_ID).removeClass("active"); // hide trash icon
  $("#"+CAMERA_BUTTON_ID).removeClass("active"); // hide camera icon
  $("#"+STICKER_BUTTON_ID).removeClass("active"); // hide sticker button
  $("#"+REMOVE_STICKER_BUTTON_ID).removeClass("active"); // hide reset button on desktop only
 
  if (mobile) {
    $("#"+DOWNLOAD_OVERLAY_ID).slideUp(function() {
      $("#"+DOWNLOAD_OVERLAY_ID).removeClass('active');
      $("#"+PROMOCODE_CONTAINER_ID).addClass('active');
    });
  } else {
    $("#"+PROMOCODE_CONTAINER_ID).addClass('active');
    
    // enable mobile button
    $("#"+DOWNLOAD_IMAGE_URL_ID).attr("href", dataURLtoBlob($("#"+SAVED_IMAGE_ID).attr("src")));
  }
});

/**
 * EVENT: 'notification popup'
 **/ 
$(window).on('notification', function(e, text, isOption, cb) {
  $("#"+NOTIFICATION_ID).addClass("active"); // entire notification container
  $("#"+NOTIFICATION_CONTENT_ID).html(text); // content of notification
  $("#"+NOTIFICATION_CONFIRM_ID).removeClass("active"); // the ok/cancel option
  $("#"+NOTIFICATION_ALERT_ID).removeClass("active"); // the ok option
  
  /*
  var NOTIFICATION_ALERT_OK_BUTTON_ID = 'notification-alert-ok';
  var NOTIFICATION_CONFIRM_OK_BUTTON_ID = 'notification-confirm-ok';
  var NOTIFICATION_CONFIRM_CANCEL_BUTTON_ID = 'notification-confirm-cancel';
  */

  if (isOption) {
    $("#"+NOTIFICATION_CONFIRM_ID).addClass("active");
    
    // OK
    $("#"+NOTIFICATION_CONFIRM_OK_BUTTON_ID).off();
    $("#"+NOTIFICATION_CONFIRM_OK_BUTTON_ID).click(function() {
      $("#"+NOTIFICATION_ID).removeClass("active");        
      if (cb) { cb(); }
    });
    
    // cancel
    $("#"+NOTIFICATION_CONFIRM_CANCEL_BUTTON_ID).off();
    $("#"+NOTIFICATION_CONFIRM_CANCEL_BUTTON_ID).click(function() {
      $("#"+NOTIFICATION_ID).removeClass("active");        
    });
    
  } else {
    $("#"+NOTIFICATION_ALERT_ID).addClass("active");
    
    // OK
    $("#"+NOTIFICATION_ALERT_OK_BUTTON_ID).off();
    $("#"+NOTIFICATION_ALERT_OK_BUTTON_ID).click(function() {
      $("#"+NOTIFICATION_ID).removeClass("active");        
      if (cb) { cb(); }
    });
  }
});



 