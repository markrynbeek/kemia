/*
 * Copyright (c) 2010 Mark Rijnbeek (markr@ebi.ac.uk)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 */
goog.provide('kemia.ring.Ring');

goog.require('kemia.model.Flags');
goog.require('goog.array');
goog.require('goog.structs.Map');
goog.require('goog.memoize');

/**
 * Creates a new Ring
 * 
 * @param {Array.
 *            <kemia.model.Atom>} atoms
 * @param {Array.
 *            <kemia.model.Bond>} bonds
 * @constructor
 */
kemia.ring.Ring = function(atoms, bonds) {
	/** @type {Array.<kemia.model.Atom>} */
	this.atoms = atoms;
	/** @type {Array.<kemia.model.Bond>} */
	this.bonds = bonds;

	/**
	 * Array with property flags (true/false)
	 * 
	 * @type {Array.<boolean>}
	 */
	this.flags = new Array(kemia.model.Flags.MAX_FLAG_INDEX + 1);

	/**
	 * @type {goog.math.Coordinate}
	 * @private
	 */
	this._center = null;
}

/**
 * Set a flag to be true or false
 * 
 * @param {kemia.model.Flags}
 *            flag_type
 * @param {boolean}
 *            flag_value true or false
 */
kemia.ring.Ring.prototype.setFlag = function(flag_type, flag_value) {
	this.flags[flag_type] = flag_value;
}

/**
 * get ring center
 * 
 * @return {goog.math.Coordinate}
 */
kemia.ring.Ring.prototype.getCenter = function() {

	if (!this._center) {
		var avgX = 0;
		var avgY = 0;
		for ( var j = 0, jl = this.atoms.length; j < jl; j++) {
			avgX += this.atoms[j].coord.x;
			avgY += this.atoms[j].coord.y;
		}
		this._center = new goog.math.Coordinate(avgX / this.atoms.length, avgY
				/ this.atoms.length);
	}
	return this._center;
};

/** 
 * force recalc of ring center
 */
kemia.ring.Ring.prototype.resetRingCenter = function(){
	this._center = undefined;
}

kemia.ring.Ring.prototype.toString = function(){
	return "kemia.ring.Ring " +			
	"\n\t" +
	goog.array.map(this.atoms, function(atom) {
		return " " + atom.toString();
	}, this).join("\n\t")
	+ "\n\t"
	+ goog.array.map(
			this.bonds,
			function(bond) {
				return " " +  bond.toString();
			}, this).join("\n\t") + "\n\t";
}
