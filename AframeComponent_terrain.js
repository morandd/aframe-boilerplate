//var coordinates = AFRAME.utils.coordinates;
//var resolution = new THREE.Vector2 ( window.innerWidth, window.innerHeight);


AFRAME.registerComponent('terrain', {
  schema: {
    color: { default: '#000' },
    lineWidth: { default: 10 },
    heightmap: {default: ''},
    texture: {default: ''},
    width: {default:-1},
    height: {default: -1},
    zheight: {default:1} /* Height, in meters */
  },

  init: function () {
    if (this.el.sceneEl.hasLoaded) {
      this._init();
    } else {
      this.el.sceneEl.addEventListener('loaded', this._init.bind(this));
    }
  },

  _init: function () {
  },

  update: function () {
    var img = new Image();
    img.aframeobject = this;
    img.onload = function () {
    
      //get height data from img. Always in range [0-63.75]. Note this function is in dan-utils.
      var data = getHeightData(img);
      
      // plane
      var w = img.aframeobject.data.width ==-1? img.width/10 :  img.aframeobject.data.width;
      var h = img.aframeobject.data.height ==-1? img.height/10 :  img.aframeobject.data.height;
      
      var geometry = new THREE.PlaneGeometry(w, h, img.width-1,img.height-1);
      
      var texture = new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
      texture.image = new Image();
      texture.image.onload = function () {
        texture.image.loaded = 1;
      };
//      texture.image.src = this.aframeobject.data.texture;
      
      var texture = THREE.ImageUtils.loadTexture( this.aframeobject.data.texture );
      var mmaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      var material = new THREE.MeshLambertMaterial( { map: texture } );
      
//      var material = new THREE.MeshPhongMaterial( { map: texture, ambient: 0xaaaaaa, specular: 0xffffff, shininess: 0, shading: THREE.SmoothShading } );


      plane = new THREE.Mesh( geometry, material );
      
      //set height of vertices
      for ( var i = 0; i<plane.geometry.vertices.length; i++ ) {
        // Rotate is needed to translate from THREE to AFRAME definiton of "z" (depth->height)
        //plane.geometry.vertices[i].x = data[i];
        //plane.geometry.vertices[i].z = plane.geometry.vertices[i].y;
        plane.geometry.vertices[i].z = data[i]/63.75 * this.aframeobject.data.zheight;
      }
      

      // Bit ugly way to get the THREE out of this function
      img.aframeobject.el.setObject3D('mesh', plane);
      //this.plane = plane;
    
    };
    // load img source
    img.src = this.data.heightmap;


  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }
});