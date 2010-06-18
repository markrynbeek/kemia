goog.provide('jchemhub.view.SingleDownBondRenderer');
goog.require('jchemhub.view.BondRenderer');

/**
 * Class to render a Single-Down bond object to a graphics object
 * 
 * @constructor
 * @param graphics
 *            {goog.graphics.AbstractGraphics} graphics to draw on.
 * @extends {jchemhub.view.BondRenderer}
 */
jchemhub.view.SingleDownBondRenderer = function(controller, graphics, opt_config) {
	jchemhub.view.BondRenderer.call(this, controller, graphics, opt_config,
			jchemhub.view.SingleDownBondRenderer.defaultConfig);

}
goog.inherits(jchemhub.view.SingleDownBondRenderer, jchemhub.view.BondRenderer);

jchemhub.view.SingleDownBondRenderer.prototype.render = function(bond, transform, path) {
	jchemhub.view.SingleDownBondRenderer.superClass_.render.call(this, bond,
			transform);

	var width = this.config.get("bond")['stroke']['width'] / 10;
	var theta = jchemhub.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);
	var transleft = new jchemhub.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* width, Math.sin(angle_left) * width);

	var transright = new jchemhub.graphics.AffineTransform(1, 0, 0, 1,Math
			.cos(angle_right)
			* width, Math.sin(angle_right) * width);

	var leftside = transleft.transformCoords([bond.source.coord, bond.target.coord]);
	var rightside = transright.transformCoords([bond.source.coord, bond.target.coord]);

    var coords = transform.transformCoords( [ leftside[0],leftside[1], rightside[0], rightside[1], bond.source.coord ]);

    var lines=7;
	var correct=0;
	if( bond.target.symbol!="C")
	   correct=1;
    for ( var j = 0; j < (lines-correct); j++) {
        path.moveTo( (((lines-j)*coords[4].x)+(j*coords[1].x))/lines, 
                     (((lines-j)*coords[4].y)+(j*coords[1].y))/lines);

        path.lineTo( (((lines-j)*coords[4].x)+(j*coords[3].x))/lines, 
                     (((lines-j)*coords[4].y)+(j*coords[3].y))/lines);
    }

}
