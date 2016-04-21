
//check6885eleven

var nodes = new Array(100);
var mlinks = new Array(100);

var attachmentStrengthMap = NaN;

var globeLinkProbabilities = new Image();
globeLinkProbabilities.onload = function(){
	attachmentStrengthMap = getHeightData(this);
	go();
}
globeLinkProbabilities.src = "img/globeLinkProbabilities.png";

function getAttachmentProbabilityAt(lat,lon){
	var row = lat;
	var col = lon;
	if (attachmentStrengthMap === NaN) {
		console.log("No map.");
		return 0;
	}
	return attachmentStrengthMap[row * globeLinkProbabilities.height + col] / 63.75;
}



var MRIONode = function(){
	
	this.pos = {
		x: Math.random(),
		y: Math.random()
	}
	
	
	var latlonok = false;
	while (!latlonok){
		this.pos.lat = Math.floor(Math.random() * 180);
		this.pos.lon = Math.floor(Math.random() * 360);
		this.attachmentStrength = Math.random();
		if (this.attachmentStrength > getAttachmentProbabilityAt(this.pos.lat, this.pos.lon)) {
			//console.log('Attached! Strength ' + attachmentStrength + " connected to pixel with str " + getAttachmentProbabilityAt(this.pos.lat, this.pos.lon));
			latlonok=true;
		} else {
			//console.log('Failed to attach. Strength ' + attachmentStrength + " connected to pixel with str " + getAttachmentProbabilityAt(this.pos.lat, this.pos.lon));
		}
		
		//latlonok = true;
	}
		
} // MRIONodes

/*
 *  This object defines a link between node A and node B. It is not directed.
 */
var MRIOLink = function(){
	this.a  = Math.floor(Math.random() * nodes.length);
	this.b  = Math.floor(Math.random() * nodes.length);
}

function go(){
	for (var i=0; i<nodes.length; i++) nodes[i] = new MRIONode();
	for (var i=0; i<mlinks.length; i++) mlinks[i] = new MRIOLink();
	
	var scene = d3.select("a-sphere");
	var links = scene.selectAll("a-entity.meshline").data(mlinks);
	links.enter().append("a-entity").classed("meshline", true)
	links.attr({
		meshline: function(d,i){
			var s=10;
			var radius=2;
			var altitude = 0;	
			var nodeA = nodes[d.a];
			var nodeB = nodes[d.b];
			
			var wa = latlonToSphere(nodeA.pos.lat-90, nodeA.pos.lon-180, altitude, radius);
			var wb = latlonToSphere(nodeB.pos.lat-90, nodeB.pos.lon-180, altitude, radius);
			
			return "path: " + wa.x + " " + wa.y + " " + wa.z+", " + wb.x +" " +wb.y +" "+wb.z +"; lineWidth:" +1;// + (nodeA.attachmentStrength*2);
		}
	})
}

function latlonToSphere(latit, longit, altid, rad) {
	x = Math.sin(longit) * Math.cos(latit);
	z = Math.sin(longit) * Math.sin(latit);
	y = Math.cos(longit);
	return {x: x*altid + x*rad, z:y*altid+y*rad, y:z*altid+z*rad  };
}


