goog.provide('jchemhub.model.SingleBondDown');
goog.require('jchemhub.model.SingleBond');

/**
 * Class representing a Single Bond with Down sterochemistry
 * 
 * @param {jchemhub.model.Atom}
 *            source Atom at one end of bond.
 * @param {jchemhub.model.Atom}
 *            target Atom at other end of bond.
 * @constructor
 * @extends {jchemhub.model.SingleBond}
 */
jchemhub.model.SingleBondDown = function(source, target, opt_molecule) {
	jchemhub.model.SingleBond.call(this, source, target, opt_molecule);
        this.order = 1;
}
goog.inherits(jchemhub.model.SingleBondDown, jchemhub.model.SingleBond);

/**
 * 
 * @return {jchemhub.model.SingleBondDown}
 */
jchemhub.model.SingleBondDown.prototype.clone = function() {
	return new jchemhub.model.SingleBondDown(this.source, this.target,
			this.molecule);
}
