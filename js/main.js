import "core-js/stable";
import "regenerator-runtime/runtime";
import { ACESFilmicToneMapping, Material, Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, SphereBufferGeometry, sRGBEncoding, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { NodeEditor } from './editor/node-editor/NodeEditor';
import { nodeFrame } from './editor/renderers/webgl/nodes/WebGLNodes.js';




/// scene

const width = 350;
const height = 350;

const scene = new Scene();
const camera = new PerspectiveCamera( 75, width / height,  0.1, 1000 );

const renderer = new WebGLRenderer({
	antialias: true,
	powerPreference: 'high-performance',
	canvas: document.querySelector('.three-view')
});

renderer.outputEncoding = sRGBEncoding
renderer.toneMapping = ACESFilmicToneMapping
renderer.toneMappingExposure = 4.0

renderer.setSize( width, height );

const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 2;
controls.maxDistance = 10;

/// mesh 

const geometry = new SphereBufferGeometry( 2, 50, 50 );
const material = new MeshStandardMaterial( { color: 0x555555 } );
const mesh = new Mesh( geometry, material );
mesh.name = "sphere";
scene.add( mesh );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

	nodeFrame.update();
	renderer.render( scene, camera );
}
animate();


const pmremGenerator = new PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader();

/// Env light
new EXRLoader()
.setPath( '/' )
.load( 'adams_place_bridge_1k-float.exr', ( texture ) => {

	const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

	scene.environment = envMap;

	texture.dispose();
	pmremGenerator.dispose();
} );


/// editor 

const nodeEditor = new NodeEditor(scene);



Material.prototype.onBeforeCompile = (shader , renderer )=>{

	document.querySelector( '.vertex-shader' ).textContent = shader.vertexShader;
	document.querySelector( '.fragment-shader' ).textContent = shader.fragmentShader;

}

document.body.prepend( nodeEditor.domElement );
