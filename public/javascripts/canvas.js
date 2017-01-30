/* globals $ */
/* globals loadImage */
/* globals mobile */
   
var CAMERA_ID = 'camera';
var START_BUTTON_ID = 'start-button';
var CAMERA_BUTTON_ID = 'camera-button';
var SAVE_BUTTON_ID = 'save-button';
var STICKER_BUTTON_ID = 'sticker-button';
var REMOVE_STICKER_BUTTON_ID = 'remove-sticker-button';

var EDITOR_CONTAINER_ID = 'editor-middle';
var CANVAS_ID = 'canvas';
var SAVED_IMAGE_ID = 'saved-img';
var TRASH_BUTTON_ID = 'trash-button';
var CAMERA_ICON_ID = 'camera-icon';
var CANVAS_INSTRUCTION_ID = 'canvas-instruction';

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

var START_MODAL_WRAPPER_ID = 'upload-modal-wrapper';
var CLOSE_START_MODAL_BUTTON_ID = 'upload-modal-close';
var BACKDROP_CONTAINER_ID = 'select-backdrop';

var SIZE_MULTIPLIER = 2; // how much to scale the downloaded/saved image 
var stickerStack = []; // stack of active stickers
var storedFileId = ''; // storedFileId

$(document).ready(function() {

  /**
   * Initialize start modal events
   **/
  $("#"+START_BUTTON_ID).click(function() {
    $(window).trigger("openStartModal", [ /* param1, param2 */]);
  });
  $("#"+CLOSE_START_MODAL_BUTTON_ID).click(function() {
    $(window).trigger("closeStartModal", [ /* param1, param2 */]);
  });

  /**
   * Take picture / Upload picture and put picture in the background canvas
   **/
   
  var camera = document.getElementById(CAMERA_ID);
  
  camera.addEventListener('change', function(e) {
    var file = e.target.files[0]; 
    var fileName = file.name;
    var isUrl = false;
    loadImageToCanvas(file, fileName, isUrl);
  });
   
  /**
   * Generate backdrops from images/backdrops/ directory
   **/
  var backdropPaths = [
    "/images/backdrops/backdrop-1.jpg",
    "/images/backdrops/backdrop-2.jpg",
    "/images/backdrops/backdrop-3.jpg"
  ];
  var mobileBackdropPaths = [
    "/images/backdrops/m-backdrop-1.jpg",
    "/images/backdrops/m-backdrop-2.jpg",
    "/images/backdrops/m-backdrop-3.jpg"
  ];
  var backdropContainer = $("#"+BACKDROP_CONTAINER_ID);
  
  for (var i=0; i < backdropPaths.length; i++) {
    var backdropPath;
    if (mobile) {
      backdropPath = mobileBackdropPaths[i];
    } else {
      backdropPath = backdropPaths[i];
    }
    var element = $("<div class='backdrop'><img src='"+backdropPath+"'/></div>");
    backdropContainer.append(element);
  }
  
  
  /**
   * Generate sticker menu from stickers in images/stickers/ directory
   **/
    
  var stickerPaths = [
    ["/images/stickers/girli1.png", ""],
    ["/images/stickers/girli2.png", ""],
    ["/images/stickers/girli3.png", ""],
    ["/images/stickers/girli5.png", ""],
    ["/images/stickers/girli6.png", ""],
    ["/images/stickers/girli7.png", ""],
    ["/images/stickers/zoomer-zuppies-interactive-puppy.png", "Zoomer Zuppies Interactive Puppy"],
    ["/images/stickers/sophie-hulme-puffball.png", "Sophie Hulme Puffball"],
    ["/images/stickers/wowwee-lumi-drone.png", "WowWee Lumi Drone"],
    ["/images/stickers/okgrl-xbox-controller.png", "OKgrl Xbox Controller"],
    ["/images/stickers/jiri-pelcl-erratic-bookcase.png", "Jiri Pelcl Erratic Bookcase"],
    ["/images/stickers/katie-stout-yellow-chair.png", "Katie Stout Yellow Chair"],
    ["/images/stickers/versace-pink-chair.png", "Versace Pink Chair"],
    ["/images/stickers/miumiu-sunglasses.png", "Miu Miu Sunglasses"],
    ["/images/stickers/pocari-sweat.png", "Pocari Sweat"],
    ["/images/stickers/wowwee-chip-robot-toy-dog.png", "WowWee Chip Robot Toy Dog"], 
    ["/images/stickers/pretty-pink-boombox.png", "Pretty Pink Boombox"],
    ["/images/stickers/snapchat-glasses.png", "Snapchat Glasses"],
    ["/images/stickers/hello-kitty-guitar.png", "Hello Kitty Guitar"],
    ["/images/stickers/versace-chair.png", "Versace Chair"],
    ["/images/stickers/zaha-hadid-3d-printed-chair.png", "Zaha Hadid 3D Printed Chair"],
    ["/images/stickers/hatchimal.png", "Hatchimal"],
    ["/images/stickers/palm-tree.png", "Palm Tree"],
    ["/images/stickers/chad-phillips-lamp.png", "Chad Phillips Lamp"],
    ["/images/stickers/charlotte-olympia-purse.png", "Charlotte Olympia Purse"],
    ["/images/stickers/wendell-castle-molar-couch.png", "Wendell Castle Molar Couch"],
    ["/images/stickers/nicki-minaj-beats.png", "Nicki Minaj Beats"],
    ["/images/stickers/pink-yoga-ball.png", "Pink Yoga Ball"],
    ["/images/stickers/haas-brothers-mary-kate-and-ashley.png", "Haas Brothers Mary Kate and Ashley Lamp"],
    ["/images/stickers/versace-x-haas-brothers-stool.png", "Versace X Haas Brothers Stool"],
    ["/images/stickers/zan-headgear-facemask.png", "Zan Headgear Facemask"],
    ["/images/stickers/troll-wig.png", "Troll Wig"],
    ["/images/stickers/louis-vuitton-x-tokujin-yoshioka-blossom-stool.png", "Louis Vuitton X Tokujin Yoshioka"],
    ["/images/stickers/azuma-makota-botanical-sofa.png", "Azuma Makota Botanical Sofa"],
    ["/images/stickers/castiglioni-stella-stool.png", "Castiglioni Stella Stool"],
    ["/images/stickers/rawlings-helmet.png", "Rawlings Helmet"],
    ["/images/stickers/skinny-dip-london-iphone-case-1.png", "Skinny Dip London iPhone"],
    ["/images/stickers/skinny-dip-london-iphone-case-2.png", "Skinny Dip London iPhone"],
    ["/images/stickers/alexander-wang-hat.png", "Alexander Wang Hat"],
    ["/images/stickers/furby.png", "Furby"],
    ["/images/stickers/razor-lil-kick-scooter.png", "Razor Lil Kick Scooter"], 
    ["/images/stickers/moschino-belt.png", "Moschino Belt"],
    ["/images/stickers/fila-sandal.png", "Fila Sandal"],
    ["/images/stickers/givenchy-sandal.png", "Givenchy Sandal"],
    ["/images/stickers/acne-boot.png", "Acne Boot"],
    ["/images/stickers/ibex-thermal-fleece.png", "Ibex Thermal Fleece"],
    ["/images/stickers/skinnydip-mr-burns-flying-money-bag.png", "Skinnydip Mr Burns Flying Money Bag"],
    ["/images/stickers/kenzo-clutch.png", "Kenzo Clutch"],
    ["/images/stickers/st-laurent-boot.png", "Saint Laurent Boot"],
    ["/images/stickers/miu-miu-boot.png", "Miu Miu Boot"],
    ["/images/stickers/marc-jacobs-purse.png", "Marc Jacobs Purse"],
    ["/images/stickers/tabanlioglu-architects-wallpiece.png", "Tabanlioglu Architects Wallpiece"],
    ["/images/stickers/orchid.png", "Orchid"]
  ];
  var stickersContainer = $("#"+STICKER_MENU_STICKERS_ID);
  
  var columns = [];
  for (var i=0; i < stickerPaths.length; i++) {
    
    var stickerPath = stickerPaths[i][0];      
    var stickerName = stickerPaths[i][1];      
    
    var imgElement = $("<img class='sticker-icon' src='"+stickerPath+"'/>");
    var labelElement = $("<div class='sticker-label'>"+stickerName+"</div>");
    var colElement = $("<div class='col-xs-6 sticker-menu-col'></div>");
    colElement.append(imgElement);
    colElement.append(labelElement);
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

function loadImageToCanvas(file, fileName, isUrl) {
  //var file = e.target.files[0]; 
  //var fileName = file.name;
  
  var editor = $("#"+EDITOR_CONTAINER_ID);
  
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
      /*
      var data = tempCanvas.toDataURL('image/png');
      var d = new Date();
      
      // fileId: raw-dd/mm/yyyy-time-<fileName>
      var fileId = d.getMonth() + "" +
                   d.getDate() + "" +
                   d.getYear() + "-" + 
                   d.getTime() + "-" + fileName;
                   
      storedFileId = fileId;
      $.post("/raw-image", { image: data, fileId: storedFileId }, function(data) {});
      */
      
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
      $(canvas).css("border", "10px solid white");
      
      // canvas is ready!
      $(window).trigger("uploadImage", [ /* param1, param2 */]);
      
      // close start modal 
      $(window).trigger("closeStartModal", [ /* param1, param2 */]);
      
    }, options);
  });
}

/**
 * EVENT: 'open start modal'
 **/
$(window).on("openStartModal", function(e, p1, p2) {
  $("#"+START_MODAL_WRAPPER_ID).addClass("active");    
  $(".backdrop > img").each(function() {
    $(this).off('click');
    $(this).click(function() {
      var url = $(this).attr("src");
      var fileName = url.substr(url.lastIndexOf('/') + 1);
      var isUrl = true;
      loadImageToCanvas(url, fileName, isUrl);
    });
  });
});

/**
 * EVENT: 'close start modal'
 **/
$(window).on("closeStartModal", function(e, p1, p2) {
  $("#"+START_MODAL_WRAPPER_ID).removeClass("active");    
});
 
/**
 * EVENT: 'uploadImage'
 **/ 
$(window).on("uploadImage", function(e, p1, p2) {
  // update buttons
  $("#"+SAVE_BUTTON_ID).addClass("active"); // show save button
  $("#"+TRASH_BUTTON_ID).addClass("active"); // show trash icon
  $("#"+CANVAS_INSTRUCTION_ID).addClass("active"); // show canvas instruction text 
  $("#"+START_BUTTON_ID).removeClass("active"); // hide camera icon
  $("#"+CAMERA_BUTTON_ID).removeClass("active"); // hide camera icon
  $("#"+INSTRUCTIONS_CONTAINER_ID).removeClass("active"); // show sticker button
  if (mobile) {
    $("#"+STICKER_BUTTON_ID).addClass("active"); // show sticker button
  } else {
    $("#"+REMOVE_STICKER_BUTTON_ID).addClass("active"); // show reset button on desktop only
  }
  
  // open up the sticker menu
  $("#nav-button-close").click();
  
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
    var msg = "The remove-sticker button won't work if there are no stickers! Start by adding stickers from the panel on the right.";
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
  $(img).css("border", "10px solid white");
  
  $("#"+EDITOR_CONTAINER_ID).append(img);
  $("#"+SAVE_BUTTON_ID).off();
  
  // send original image, stickers and final image to the server
  /*
  $.post("/edited-image", 
    { image: dataURL, fileId: storedFileId }, 
    function() {});
  */
  
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
  $("#"+START_BUTTON_ID).addClass("active"); // hide camera icon
  $("#"+STICKER_BUTTON_ID).removeClass("active"); // show sticker button
  $("#"+REMOVE_STICKER_BUTTON_ID).removeClass("active"); // hide reset button on desktop only
  $("#"+INSTRUCTIONS_CONTAINER_ID).addClass("active"); // show sticker button
  $("#"+SAVE_BUTTON_ID).removeClass('active'); // hide download button
  $("#"+CANVAS_INSTRUCTION_ID).removeClass("active"); // hide canvas instruction text 
  $("#"+TRASH_BUTTON_ID).removeClass("active"); // hide trash icon
 
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
  $("#"+START_BUTTON_ID).removeClass("active"); // hide save button
  $("#"+CANVAS_INSTRUCTION_ID).removeClass("active"); // hide canvas shift instructions
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
    
    // open navigation menu
    $("#nav-container").animate({ right: 0 });
    $("#nav-button-close").hide();
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



 