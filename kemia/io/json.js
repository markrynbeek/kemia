//License and copyright

/**
 * @fileoverview io utility functions and factory methods for JSON formats
 */
goog.provide('kemia.io.json');

goog.require('kemia.model.Reaction');
goog.require('kemia.model.Molecule');
goog.require('kemia.model.Bond');
goog.require('kemia.model.Atom');
goog.require('goog.json');
goog.require('goog.array');


/**
 * uses JSON.parse and .stringify; needs def for IE and ?? This allows for a
 * JSON external representation that uses bond atom-index instead of atom
 * objects. So, there are 3 types of things of import here: 1. The actual
 * Molecule object (typically mol here) 2. The object (typically jmol here) in
 * which bond's atom objects are recast as atom indexes 3. The string
 * representaion of jmol There is not use for the JSON string represention of
 * the actual Molecule object.
 */

/**
 * enum for bond types
 * 
 * @enum {string}
 */ 
kemia.io.json.BondType = {
		SINGLE_BOND:"SINGLE_BOND",
		DOUBLE_BOND:"DOUBLE_BOND",		
		TRIPLE_BOND:"TRIPLE_BOND",
		QUADRUPLE_BOND:"QUADRUPLE_BOND",
		AROMATIC:"AROMATIC",
		SINGLE_OR_DOUBLE:"SINGLE_OR_DOUBLE",
		SINGLE_OR_AROMATIC:"SINGLE_OR_AROMATIC",
		DOUBLE_OR_AROMATIC:"DOUBLE_OR_AROMATIC",
		ANY:"ANY"
};

/**
 * enum for stereo types
 * 
 * @enum {string}
 */ 
kemia.io.json.StereoType = {
		NOT_STEREO:"NOT_STEREO",
		SINGLE_BOND_UP:"SINGLE_BOND_UP",
		SINGLE_BOND_UP_OR_DOWN:"SINGLE_BOND_UP_OR_DOWN",
		SINGLE_BOND_DOWN:"SINGLE_BOND_DOWN"
};

/**
 * maps bond class to bond type code
 * 
 * @param{kemia.model.Bond} bond
 * @return{kemia.io.json.BondType}
 */
kemia.io.json.getTypeCode = function(bond){
	if (bond.order == kemia.model.Bond.ORDER.SINGLE){
		return kemia.io.json.BondType.SINGLE_BOND;
	}
	if (bond.order == kemia.model.Bond.ORDER.DOUBLE){
		return kemia.io.json.BondType.DOUBLE_BOND;
	}
	if (bond.order == kemia.model.Bond.ORDER.TRIPLE){
		return kemia.io.json.BondType.TRIPLE_BOND;
	}
	if (bond.order == kemia.model.Bond.ORDER.QUADRUPLE){
		return kemia.io.json.BondType.QUADRUPLE_BOND;
	}
	throw new Error("Invalid bond type [" + bond.toString() + "]");
	
};

/**
 * maps bond class to stereo type code
 * 
 * @param{kemia.model.Bond} bond
 * @return{kemia.io.json.StereoType}
 */
kemia.io.json.getStereoCode = function(bond){
	if (bond.stereo == kemia.model.Bond.STEREO.UP){
		return kemia.io.json.StereoType.SINGLE_BOND_UP;
	}
	if (bond.stereo == kemia.model.Bond.STEREO.DOWN){
		return kemia.io.json.StereoType.SINGLE_BOND_DOWN;
	}
	if (bond.stereo == kemia.model.Bond.STEREO.UP_OR_DOWN){
		return kemia.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN;
	}
	return kemia.io.json.StereoType.NOT_STEREO;
}


/**
 * factory method for bonds
 * 
 * @param{kemia.io.json.BondType}type bond-type code
 * @param{kemia.io.json.StereoType}stereo stereo-type code
 * @param{kemia.model.Atom} source atom at source end of bond
 * @param{kemia.model.Atom} target atom at target end of bond
 * 
 * @return{kemia.model.Bond}
 */
kemia.io.json.createBond = function(type, stereo, source, target) {
	switch (type) {
	case kemia.io.json.BondType.SINGLE_BOND:
		switch (stereo) {
		case kemia.io.json.StereoType.NOT_STEREO:
			return new kemia.model.Bond(source, target);
		case kemia.io.json.StereoType.SINGLE_BOND_UP:
			return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.SINGLE, kemia.model.Bond.STEREO.UP);
		case kemia.io.json.StereoType.SINGLE_BOND_UP_OR_DOWN:
			return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.SINGLE, kemia.model.Bond.STEREO.UP_OR_DOWN);
		case kemia.io.json.StereoType.SINGLE_BOND_DOWN:
			return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.SINGLE, kemia.model.Bond.STEREO.DOWN);
		default:
			throw new Error("invalid bond type/stereo [" + type + "]/["
					+ stereo + "]");
		};
	case kemia.io.json.BondType.DOUBLE_BOND:
		return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.DOUBLE);
	case kemia.io.json.BondType.TRIPLE_BOND:
		return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.TRIPLE);
	case kemia.io.json.BondType.QUADRUPLE_BOND:
		return new kemia.model.Bond(source, target, kemia.model.Bond.ORDER.QUADRUPLE);
	case kemia.io.json.BondType.AROMATIC:
		return new kemia.model.Bond(source, target, undefined, undefined, true);
	case kemia.io.json.BondType.SINGLE_OR_DOUBLE:
	case kemia.io.json.BondType.SINGLE_OR_AROMATIC:
	case kemia.io.json.BondType.DOUBLE_OR_AROMATIC: 
	case kemia.io.json.BondType.ANY: 
	default:
		throw new Error("invalid bond type/stereo [" + type + "]/[" + stereo
				+ "]");
	};
};


/**
 * convert jmol JSON object or string to molecule
 * 
 * @param{kemia.io.json.Molecule|string} arg
 * @return{kemia.model.Molecule}
 */
kemia.io.json.readMolecule = function(arg) {
	/** @type {kemia.io.json.Molecule} */
	var jmol;
	if (arg.constructor == String) {
		jmol = /** @type {kemia.io.json.Molecule} */(goog.json.parse(arg));
	} else {
		jmol =  /** @type {kemia.io.json.Molecule} */(arg);
	}
	var mol = new kemia.model.Molecule();
	mol.name = jmol['name'];
	goog.array.forEach(jmol['atoms'], function(a){
		mol.addAtom(new kemia.model.Atom(a['symbol'], a['coord']['x'], a['coord']['y'], a['charge']));
	});
	goog.array.forEach(jmol['bondindex'], function(b){
		mol.addBond(kemia.io.json.createBond(b['type'], b['stereo'], mol.getAtom(b['source']), mol.getAtom(b['target'])));
	});
	return mol;
};
goog.exportSymbol('kemia.io.json.readMolecule', kemia.io.json.readMolecule);

/** @return {string} */
kemia.io.json.writeMolecule = function(mol) {
	return new goog.json.Serializer().serialize(kemia.io.json.moleculeToJson(mol));
};
goog.exportSymbol('kemia.io.json.writeMolecule', kemia.io.json.writeMolecule);


/** @typedef {{header: string, reactants: Array, products: Array}} */ 
kemia.io.json.Reaction;
/** @typedef {{symbol: string, coord: kemia.io.json.Coordinate, charge: number}} */
kemia.io.json.Atom;
/** @typedef {{x:number,y:number}} */
kemia.io.json.Coordinate;
/** @typedef {{source: number, target: number, type: string, stereo: string}} */
kemia.io.json.Bond;
/**
 * @typedef {{
 *     name: string, 
 *     atoms: Array.<kemia.io.json.Atom>, 
 *     bondindex: Array.<kemia.io.json.Bond>}}
 */
kemia.io.json.Molecule;

/**
 * convert molecule object to json representation
 * 
 * @param {kemia.model.Molecule}
 *            mol the molecule to convert
 * @returns {kemia.io.json.Molecule} in json molecule format
 */
kemia.io.json.moleculeToJson = function(mol) {
	/** @type {Array.<kemia.io.json.Atom>} */
	var atoms = goog.array.map(mol.atoms, function(a){
		return {symbol: a.symbol, coord:{x: a.coord.x, y: a.coord.y}, charge: a.charge};
	});
	/** @type {Array.<kemia.io.json.Bond>} */
	var bonds = goog.array.map(mol.bonds, function(b){
		var btype =   kemia.io.json.getTypeCode(b);
		var bstereo = kemia.io.json.getStereoCode(b);
		return { source : mol.indexOfAtom(b.source), target : mol.indexOfAtom(b.target), type : btype, stereo : bstereo
		}
	});

	return {
		name : mol.name,
		atoms : atoms,
		bondindex : bonds
	};
};

/**
 * convert JSON reaction representation to reaction object
 * 
 * @param {string|kemia.io.json.Reaction}
 *            arg The JSON object string, or object itself
 * @return {kemia.model.Reaction}
 */
kemia.io.json.readReaction = function(arg) {
	/** @type {kemia.io.json.Reaction} */
	var jrxn;
	if (arg.constructor == String) {
		jrxn = /** @type {kemia.io.json.Reaction} */(goog.json.parse(arg));
	} else {
		jrxn = /** @type {kemia.io.json.Reaction} */(arg);
	}
	var rxn = new kemia.model.Reaction();
	rxn.header = jrxn['header'];
	goog.array.forEach(jrxn['reactants'], function(mol){
		rxn.addReactant(kemia.io.json.readMolecule(mol));
	});
	goog.array.forEach(jrxn['products'], function(mol){
		rxn.addProduct(kemia.io.json.readMolecule(mol));
	});

	return rxn;
};
goog.exportSymbol('kemia.io.json.readReaction', kemia.io.json.readReaction);

/**
 * converts a reaction object to JSON representation
 * 
 * @param{kemia.model.Reaction} rxn. The reaction to convert to json
 * @return{kemia.io.json.Reaction} json representation
 */
kemia.io.json.reactionToJson = function (rxn) {
	var header = rxn.header;
	var reactants = goog.array.map(rxn.reactants, kemia.io.json.moleculeToJson);
	var products = goog.array.map(rxn.products, kemia.io.json.moleculeToJson);
	return {header: header,
		reactants: reactants,
		products: products};
};

/** 
 * @param {kemia.model.Reaction} rxn the reaction to convert
 * @return {string} 
 * */
kemia.io.json.writeReaction = function(rxn){
	return new goog.json.Serializer().serialize(kemia.io.json.reactionToJson(rxn));
}
goog.exportSymbol('kemia.io.json.writeReaction', kemia.io.json.writeReaction);


