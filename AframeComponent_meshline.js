var coordinates = AFRAME.utils.coordinates;
var resolution = new THREE.Vector2 ( window.innerWidth, window.innerHeight);

AFRAME.registerComponent('meshline', {
  schema: {
    color: { default: '#000' },
    lineWidth: { default: 10 },
    path: {
      default: [
        	{ x: -0.5, y: 0, z: 0 },
        	{ x: 0.5, y: 0, z: 0 }
      ],
      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(AFRAME.utils.coordinates.parse);
      },
      // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(AFRAME.utils.coordinates.stringify).join(',');
      }
    }
  },

  init: function () {
    if (this.el.sceneEl.hasLoaded) {
      this._init();
    } else {
      this.el.sceneEl.addEventListener('loaded', this._init.bind(this));
    }
  },

  _init: function () {

  var canvas = this.el.sceneEl.canvas;
  resolution = new THREE.Vector2 ( canvas.width, canvas.height);
  this.update(); //may not be necessary

  //console.log("canvas res:");
  //console.log(resolution);
  },

  update: function () {
    //console.log("updating ..");
    //console.log("canvas res:");
    //console.log(resolution);
    var material = new THREE.MeshLineMaterial({
      color: new THREE.Color(this.data.color),
      resolution: resolution,
      sizeAttenuation: false,
      lineWidth: this.data.lineWidth,
      near: 0.1,
      far: 1000
    });
    //console.log("material:");
    //console.log(THREE.MeshLineMaterial);
    //console.log(material);
    var geometry = new THREE.Geometry();

    this.data.path.forEach(function (vec3) {
      geometry.vertices.push(
      	new THREE.Vector3(vec3.x, vec3.y, vec3.z)
      );
    });
    var  line = new THREE.MeshLine();
    line.setGeometry( geometry );
    this.el.setObject3D('mesh', new THREE.Mesh(line.geometry, material));
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }
});