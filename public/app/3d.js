var d3 = (function() {
	var PI = 3.1415926535898;
	var deg90 = PI/2;
	var deg60 = PI/3;
	var deg30 = PI/6;
	var degD9 = PI/9;

	return {
		meshes: [],
		silkWidth: 24,
		offsetAnchorX: 3,
		material: new THREE.MeshPhongMaterial({color: 0xad006f, shading: THREE.FlatShading, side: THREE.DoubleSide}),
		init: function(elem, props) {
			this.elem = elem = elem || "canvas";
			this.props = props = props || {};
			this.meshes.length = 0;
			var scene = this.scene = new THREE.Scene();
			var renderer = null;
			if (/CanvasRenderer/.test(window.location.hash)) {
				renderer = this.renderer = new THREE.CanvasRenderer();
			} else {
				renderer = this.renderer = new THREE.WebGLRenderer();
			}

			var width = props.width || window.innerWidth;
			var height = props.height || window.innerHeight
			this.offsetX = props.d2Width/2;
			this.offsetY = props.d2Height/2;

			var object, uniforms, attributes;

			attributes = {
				displacement: {	type: 'v3', value: [] },
				customColor: {	type: 'c', value: [] }
			};

			uniforms = {
				amplitude: { type: "f", value: 5.0 },
				opacity:   { type: "f", value: 0.3 },
				color:     { type: "c", value: new THREE.Color( 0xff0000 ) }
			};

			this.shaderMaterial = new THREE.ShaderMaterial( {
				uniforms:       uniforms,
				attributes:     attributes,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				blending:       THREE.AdditiveBlending,
				depthTest:      false,
				transparent:    true
			});

			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( props.width || window.innerWidth, props.height || window.innerHeight );
			renderer.setClearColor(0xeeeeee);
			renderer.domElement.id = elem;
			$(props.container || "body").append($(renderer.domElement));

			var camera = new THREE.CombinedCamera( 
									width / 2, 
									height / 2, 
									70, 
									1, 
									1000, 
									- 500, 
									1000 );
			camera.position.x = 0;
			camera.position.y = this.offsetY/2 - 25;
			camera.position.z = 200;
			camera.toOrthographic();
			camera.setZoom(1.5);

          var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
			scene.add( new THREE.AmbientLight( 0xfef1f3 ) );
			var light1 = new THREE.PointLight( 0xf1a0c3, 1, 100 );
          light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xf1a0c3 } ) ) );
          light1.position.x = 60;
          light1.position.y = 0;
          light1.position.z = 10;
          scene.add( light1 );

          for (var i = -5; i <= 5; i++) {
            for (var j = -5; j <= 5; j++) {
              var light1 = new THREE.PointLight( 0xf1a0c3, 1, 100 );
              light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xf1a0c3 } ) ) );
              light1.position.x = 120 * i;
              light1.position.y = 100 * j;
              light1.position.z = 27;
              scene.add( light1 );
            }
          }

			animate();
			function animate() {
			  	requestAnimationFrame(animate);
			  	render();
			};

			function render() {
				camera.lookAt( scene.position );

				renderer.render( scene, camera );
			}
		},

		addMesh: function(start, end) {

			var vertexPositions = [
				[start.x, - start.y, 0],
				[end.x, - end.y, 0],
				[start.x + this.offsetAnchorX, - start.y, this.silkWidth],
				[start.x + this.offsetAnchorX, - start.y, this.silkWidth],
				[end.x + this.offsetAnchorX, - end.y, this.silkWidth],
				[end.x, - end.y, 0]
			];
			var vertices = new Float32Array( vertexPositions.length * 3 ); 
			for ( var i = 0; i < vertexPositions.length; i++ ) { 
				vertices[ i * 3 + 0 ] = vertexPositions[i][0]; 
				vertices[ i * 3 + 1 ] = vertexPositions[i][1]; 
				vertices[ i * 3 + 2 ] = vertexPositions[i][2]; 
			} 
			var geometry = new THREE.BufferGeometry(); 
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) ); 
			var mesh = new THREE.Mesh( geometry, this.material );
			this.scene.add( mesh );
			this.meshes.push(mesh);
		}, 

		addMeshes: function(points) {
			function translate(point, offsetX, offsetY) {
				return {
					x: point.x - offsetX,
					y: point.y - offsetY
				};
			};
			function averagePoints(points) {
              var result = [];
              for (var i = 0; i < points.length - 1; i++) {
                result.push({
                  x: (points[i].x + points[i+1].x)/2
                  , y: (points[i].y + points[i+1].y)/2
                });
              }
              return result;
            };

			if (points && points.length > 1) {
                points = averagePoints(averagePoints(points));
				for (var i = 0; i < points.length - 1; i++) {
					this.addMesh(translate(points[i], this.offsetX, this.offsetY)
								, translate(points[i + 1], this.offsetX, this.offsetY));		
				}
			}
		}
	};
})();
