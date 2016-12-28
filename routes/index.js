var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var fs = require('fs');
var os = require('os');

var blobSvc = azure.createBlobService();
var RAW_IMAGES_CONTAINER = 'raw-images';
var EDITED_IMAGES_CONTAINER = 'edited-images';

// prepare containers
blobSvc.createContainerIfNotExists(
    RAW_IMAGES_CONTAINER, 
    { publicAccessLevel : 'blob' }, 
    function(error, result, response) {
  if(!error){
    console.log('container "'+RAW_IMAGES_CONTAINER+'" is ready!');
  } else {
    console.log(error);
  }
});
blobSvc.createContainerIfNotExists(
    EDITED_IMAGES_CONTAINER, 
    { publicAccessLevel : 'blob' }, 
    function(error, result, response) {
  if(!error){
    console.log('container "'+EDITED_IMAGES_CONTAINER+'" is ready!');
  } else {
    console.log(error);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.mobile == true) {
    res.render('m-index', { mobile: "true" });
  } else {
    res.render('index', { mobile: "false" });
  }
});

router.get('/privacy', function(req, res, next) {
  if (req.mobile == true) {
    res.render('privacy', { mobile: 'true' });
  } else {
    res.render('privacy', { mobile: 'false' });
  }
});

router.post('/raw-image', function(req, res, next) {
  var image = req.body.image.replace(/^data:image\/png;base64,/, "");
  var fileId = "raw-" + req.body.fileId;
  var path = os.tmpdir() + '/' + fileId;
  
  fs.writeFile(path, image, 'base64', function(err) {
    if (!err) {
      blobSvc.createBlockBlobFromLocalFile(RAW_IMAGES_CONTAINER, fileId, path, function() {
        res.json({
          fileId: fileId
        });
      });
    } else {
      console.log(err);
    }
  });

});

router.post('/edited-image', function(req, res, next) {
  var image = req.body.image.replace(/^data:image\/png;base64,/, "");
  var fileId = "edited-" + req.body.fileId;
  var path = os.tmpdir() + '/' +fileId;
  
  fs.writeFile(path, image, 'base64', function(err) {
    if (!err) {
      blobSvc.createBlockBlobFromLocalFile(EDITED_IMAGES_CONTAINER, fileId, path, function() {});
    } else {
      console.log(err);
    }
  });
});

module.exports = router;

