// replace smart object’s content and save psd;  
// 2011, use it at your own risk;  
#target photoshop  
if (app.documents.length > 0) {  
var myDocument = app.activeDocument;  
var theName= myDocument.name.match(/(.*)\.[^\.]+$/)[1];  
var thePath = myDocument.path;  
var theLayer = myDocument.activeLayer; 
//var theLayer = myDocument.layers["artwork"];


// psd options;  
psdOpts = new PhotoshopSaveOptions();  
psdOpts.embedColorProfile = true;  
psdOpts.alphaChannels = true;  
psdOpts.layers = true;  
psdOpts.spotColors = true;  
// check if layer is smart object;  
if (theLayer.kind != "LayerKind.SMARTOBJECT") {alert ("selected layer is not a smart object")}  
else {  
    // select files;  
    if ($.os.search(/windows/i) != -1) {var theFiles = File.openDialog ("please select files", "*.jpg;*.tif", true)}   
    else {var theFiles = File.openDialog ("please select files", getFiles, true)};  
    if (theFiles) {  
        // work through the array 
        // Back up the old layer size and restore it at the beginning of each loop iteration.
        var defaultWidth = theLayer.bounds[2] - theLayer.bounds[0];
        var defaultHeight = theLayer.bounds[3] - theLayer.bounds[1];
        var centerX = (theLayer.bounds[2] + theLayer.bounds[0])/2;
        var centerY = (theLayer.bounds[3] + theLayer.bounds[1])/2;

        for (var m = 0; m < theFiles.length; m++) {   
            //Get width and height, to determine which way to scale.
            var oldWidth = theLayer.bounds[2] - theLayer.bounds[0];
            var oldHeight = theLayer.bounds[3] - theLayer.bounds[1];
            var oldCenterX = (theLayer.bounds[2] + theLayer.bounds[0])/2;
            var oldCenterY = (theLayer.bounds[3] + theLayer.bounds[1])/2;

            //Check to see if the size needs to be reset
            if ((oldWidth != defaultWidth) || (oldHeight != defaultHeight)) {
                //Set default layer size for each iteration, so the size does not grow throughout the iterations.
                // var resizeWidth = (defaultWidth / oldWidth) * 100;
                // var resizeHeight = (defaultHeight / oldHeight) * 100;
                // theLayer.resize(resizeWidth, resizeHeight, AnchorPosition.MIDDLECENTER);
                theLayer.resize(new UnitValue(defaultWidth,'in') ,new UnitValue(defaultWidth,'in'), AnchorPosition.MIDDLECENTER);
            }

            //Check to see if the image needs to be moved back to the default center.
            if ((oldCenterY != centerY) || (oldCenterX != centerX)) {
                var deltaX = centerX - oldCenterX;  
                var deltaY = centerY - oldCenterY;  
                // move the layer into position  
                theLayer.translate(deltaX, deltaY);
            }

            theLayer = replaceContents(theFiles[m]);

            //Set width to width of defaultWidth as a starting point
            var newWidth = theLayer.bounds[2] - theLayer.bounds[0];
            var newSize = (defaultWidth / newWidth) * 100;
            theLayer.resize(newSize, newSize, AnchorPosition.MIDDLECENTER); 

            var newWidth = theLayer.bounds[2] - theLayer.bounds[0];
            //Determine whether the image is landscape (width>height) or portrait
            if (newWidth < defaultWidth) {
                //scale to fit the width to the frame
                var newSize = (defaultWidth / newWidth) * 100;
                theLayer.resize(newSize, newSize, AnchorPosition.MIDDLECENTER);            
            }

            var newHeight = theLayer.bounds[3] - theLayer.bounds[1];
            if (newHeight < defaultHeight) {
                //scale to fit the width to the frame
                var newSize = (defaultHeight / newHeight) * 100;
                theLayer.resize(newSize, newSize, AnchorPosition.MIDDLECENTER);           
            }

            var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];  
            saveJPEG(myDocument, new File(thePath+"/"+theName+"_"+theNewName+".jpg"), 12);    
            }  
        }  
    }  
};

////// get psds, tifs and jpgs from files //////  
function getFiles (theFile) {  
          if (theFile.name.match(/\.(jpg|tif)$/i) != null || theFile.constructor.name == "Folder") {  
          return true  
          };  
     };
function saveJPEG( doc, saveFile, qty ) {  
     var saveOptions = new JPEGSaveOptions( );  
     saveOptions.embedColorProfile = true;  
     saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;  
     saveOptions.matte = MatteType.NONE;  
     saveOptions.quality = qty;   
     doc.saveAs( saveFile, saveOptions, true );  
};
////// replace contents //////  
function replaceContents (newFile) {  
// =======================================================  
var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );  
    var desc3 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
    desc3.putPath( idnull, new File( newFile ) );  
    var idPgNm = charIDToTypeID( "PgNm" );  
    desc3.putInteger( idPgNm, 1 );  
executeAction( idplacedLayerReplaceContents, desc3, DialogModes.NO );  
return app.activeDocument.activeLayer  
};  