import "core-js/stable";
import "regenerator-runtime/runtime";
import { IcosahedronBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { NodeEditor } from './editor/node-editor/NodeEditor'

import { nodeFrame } from './editor/renderers/webgl/nodes/WebGLNodes.js';

// // nodeEditor.menu.show()


// const materialEditor = new StandardMaterialEditor();
// materialEditor.setPosition( ( window.innerWidth / 2 ) - 150, 100 ); // canvas position

// nodeEditor.add( materialEditor );


const width = 250;
const height = 250;

const scene = new Scene();
const camera = new PerspectiveCamera( 75, width / height,  0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( width, height );

renderer.domElement.classList.add( 'three-view' )


const geometry = new IcosahedronBufferGeometry( 2, 7 );
const material = new MeshBasicMaterial( { color: 0xFFFFFF } );
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



const nodeEditor = new NodeEditor(scene);


document.body.appendChild( nodeEditor.domElement );
document.body.appendChild( renderer.domElement );