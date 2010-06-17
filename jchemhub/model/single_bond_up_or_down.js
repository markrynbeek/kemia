goog.provide('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.SingleBond');

/**
 * Class representing a Single Bond with Up or Down stereo-chemistry
 * @param {jchemhub.model.Atom} source Atom at one end of bond.
 * @param {jchemhub.model.Atom} target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.SingleBond}
 */
jchemhub.model.SingleBondUpOrDown = function(source, target, opt_molecule){
	jchemhub.model.SingleBond.call(this, source, target, opt_molecule);
        this.order = 1;
}
goog.inherits(jchemhub.model.SingleBondUpOrDown, jchemhub.model.SingleBond);	

jchemhub.model.SingleBondUpOrDown.clone = function(){
	return new jchemhun.model.SingleBondUpOrDown(this.source, this.target, this.molecule);
}
