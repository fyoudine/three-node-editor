import { LabelElement } from '../../libs/flow.js';
import { BaseNode } from '../core/BaseNode.js';
import { MathNode, FloatNode } from '../../renderers/nodes/Nodes.js';

const NULL_VALUE = new FloatNode();

export class PowerEditor extends BaseNode {

	constructor() {

		const node = new MathNode( MathNode.POW, NULL_VALUE, NULL_VALUE );

		super( 'Power', 1, node, 175 );

		const aElement = new LabelElement( 'A' ).setInput( 1 );
		const bElement = new LabelElement( 'B' ).setInput( 1 );

		aElement.onConnect( () => {

			node.aNode = aElement.getLinkedObject() || NULL_VALUE;

		} );

		bElement.onConnect( () => {

			node.bNode = bElement.getLinkedObject() || NULL_VALUE;

		} );

		this.add( aElement )
			.add( bElement );

	}

}