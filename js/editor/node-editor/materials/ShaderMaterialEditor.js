import { ColorInput, SliderInput, LabelElement } from '../../libs/flow.js';
import { BaseNode } from '../core/BaseNode.js';
import { ShaderNodeMaterial } from '../../renderers/nodes/Nodes.js';
import * as THREE from 'three';

export class ShaderMaterialEditor extends BaseNode {

	constructor() {

		const material = new ShaderNodeMaterial();

		super( 'Standard Material', 1, material );

		this.setWidth( 300 );

		const color = new LabelElement( 'color' ).setInput( 3 );
		const opacity = new LabelElement( 'opacity' ).setInput( 1 );
		const displacement = new LabelElement( 'Displacement' ).setInput( 3 );

		color.add( new ColorInput( material.color.getHex() ).onChange( ( input ) => {

			material.color.setHex( input.getValue() );

		} ) );

		opacity.add( new SliderInput( material.opacity, 0, 1 ).onChange( ( input ) => {

			material.opacity = input.getValue();

			this.updateTransparent();

		} ) );


		color.onConnect( () => this.update(), true );
		opacity.onConnect( () => this.update(), true );
		displacement.onConnect(() => this.update(), true );

		this.add( color )
			.add( opacity )
			.add( displacement );

		this.color = color;
		this.opacity = opacity;
		this.displacement = displacement;

		this.material = material;

		this.update();

	}

	update() {

		const { material, color, opacity, displacement } = this;

		color.setEnabledInputs( ! color.getLinkedObject() );
		opacity.setEnabledInputs( ! opacity.getLinkedObject() );

		material.colorNode = color.getLinkedObject();
		material.opacityNode = opacity.getLinkedObject() || null;

		material.positionNode = displacement.getLinkedObject() || null;

		material.dispose();

		this.updateTransparent();

		// TODO: Fix on NodeMaterial System
		material.customProgramCacheKey = () => {

			return THREE.MathUtils.generateUUID();

		};

	}

	updateTransparent() {

		const { material, opacity } = this;

		material.transparent = opacity.getLinkedObject() || material.opacity < 1 ? true : false;

		opacity.setIcon( material.transparent ? 'ti ti-layers-intersect' : 'ti ti-layers-subtract' );

	}

}
