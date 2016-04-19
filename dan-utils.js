//return array with height data from img
function getHeightData(img,scale) {
	
	if (scale == undefined) scale=1;
	
	var canvas = document.createElement( 'canvas' );
	canvas.width = img.width;
	canvas.height = img.height;
	var context = canvas.getContext( '2d' );
	
	var size = img.width * img.height;
	var data = new Float32Array( size );
	
	context.drawImage(img,0,0);
	
	for ( var i = 0; i < size; i ++ ) {
		data[i] = 0
	}
	
	var imgd = context.getImageData(0, 0, img.width, img.height);
	var pix = imgd.data;
	
	var j=0;
	for (var i = 0; i<pix.length; i +=4) {
		var all = pix[i]+pix[i+1]+pix[i+2];
		data[j++] = all/(12*scale);
	}
	
	return data;
} // function getHeightData()
