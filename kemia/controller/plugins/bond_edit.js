goog.provide('kemia.controller.plugins.BondEdit');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');
goog.require('kemia.model.Bond');

/**
 * @constructor
 * @extends{kemia.controller.Plugin}
 */
kemia.controller.plugins.BondEdit = function() {
	kemia.controller.Plugin.call(this);
}
goog.inherits(kemia.controller.plugins.BondEdit, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.BondEdit',
		kemia.controller.plugins.BondEdit);

/**
 * Command implemented by this plugin.
 */
kemia.controller.plugins.BondEdit.COMMAND = 'selectBond';

/** @inheritDoc */
kemia.controller.plugins.BondEdit.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.BondEdit.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.BondEdit.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.BondEdit.COMMAND);

/**
 * sets bond order and stereo.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.BondEdit.prototype.execCommandInternal = function(
		command, var_args) {
	this.bond_type = arguments[1];
};

kemia.controller.plugins.BondEdit.SHORTCUTS = [ {
	id : '1',
	key : '1'
}, {
	id : '2',
	key : '2'
}, {
	id : '3',
	key : '3'
}, {
	id : '4',
	key : '4'
}, {
	id : '5',
	key : '5'
}, {
	id : '6',
	key : '6'
}, {
	id : '7',
	key : '7'
}, {
	id : '8',
	key : '8'
}, {
	id : '9',
	key : '9'
} ];

kemia.controller.plugins.BondEdit.prototype.getKeyboardShortcuts = function() {
	return kemia.controller.plugins.BondEdit.SHORTCUTS;
}

/**
 * @enum {Object}
 */
kemia.controller.plugins.BondEdit.BOND_TYPES = [ {
	caption : "Single",
	order : kemia.model.Bond.ORDER.SINGLE,
	stereo : kemia.model.Bond.STEREO.NOT_STEREO
}, {
	caption : "Double",
	order : kemia.model.Bond.ORDER.DOUBLE,
	stereo : kemia.model.Bond.STEREO.NOT_STEREO
}, {
	caption : "Triple",
	order : kemia.model.Bond.ORDER.TRIPLE,
	stereo : kemia.model.Bond.STEREO.NOT_STEREO
}, {
	caption : "Quadruple",
	order : kemia.model.Bond.ORDER.QUADRUPLE,
	stereo : kemia.model.Bond.STEREO.NOT_STEREO
}, {
	caption : "Single Up",
	order : kemia.model.Bond.ORDER.SINGLE,
	stereo : kemia.model.Bond.STEREO.UP
}, {
	caption : "Single Down",
	order : kemia.model.Bond.ORDER.SINGLE,
	stereo : kemia.model.Bond.STEREO.DOWN
}, {
	caption : "Single Up or Down",
	order : kemia.model.Bond.ORDER.SINGLE,
	stereo : kemia.model.Bond.STEREO.UP_OR_DOWN
} ]

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.BondEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.BondEdit');

// kemia.controller.plugins.BondEdit.prototype.handleDoubleClick = function(e) {
// this.logger.info('handleDoubleClick');
// }

kemia.controller.plugins.BondEdit.prototype.handleKeyboardShortcut = function(e) {
	// this.logger.info('handleKeyboardShortcut');
	var id = e.identifier;
	var shortcut = goog.array.find(kemia.controller.plugins.BondEdit.SHORTCUTS,
			function(obj) {
				return obj.id == e.identifier
			});
	if (shortcut) {
		// this.logger.info('getSelected ' +
		// this.editorObject.getSelected().toString());
		goog.array.forEach(this.editorObject.getSelected(), function(target) {
			// this.logger.info('target ' + target.toString());
				var repeat = parseInt(shortcut.id);
				if (target instanceof kemia.model.Atom) {
					var attachment_atom = target;
					this.editorObject.dispatchBeforeChange();
					for ( var i = 0; i < repeat; i++) {
						var new_bond = attachment_atom.molecule.sproutBond(
								attachment_atom, kemia.model.Bond.ORDER.SINGLE,
								kemia.model.Bond.STEREO.NOT_STEREO);
						if (new_bond) {
							attachment_atom = new_bond
									.otherAtom(attachment_atom);
						}
					}
					this.editorObject.setModelsSilently(this.editorObject
							.getModels());
					this.editorObject.dispatchChange();
					return true;
				}
				return true;
			}, this);
	}
}

kemia.controller.plugins.BondEdit.prototype.handleMouseMove = function(e) {

	if (this.bond_type) {
		var target = this.editorObject.findTarget(e);
		this.editorObject.clearSelected();
		this.editorObject.getOriginalElement().style.cursor = 'default';
		if (e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup.clear();
		}
		e.currentTarget.highlightGroup = undefined;

		if (target instanceof kemia.model.Atom) {
			this.editorObject.addSelected(target);
			this.editorObject.getOriginalElement().style.cursor = 'pointer';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightAtom(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightAtom(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		} else if (target instanceof kemia.model.Bond) {
			this.editorObject.addSelected(target);
			this.editorObject.getOriginalElement().style.cursor = 'pointer';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightBond(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightBond(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		}
	}
	return false;
};

kemia.controller.plugins.BondEdit.prototype.handleMouseDown = function(e) {
	this.logger.info('handleMouseDown');
	var selected = this.editorObject.getSelected();
	if (selected.length) {
		goog.array
				.forEach(
						selected,
						function(target) {
							if (target instanceof kemia.model.Atom) {
								if (this.bond_type) {
									this.editorObject.dispatchBeforeChange();
									var new_bond = target.molecule.sproutBond(
											target, this.bond_type.order,
											this.bond_type.stereo);
									this.dragBond(e, new_bond);
									this.editorObject
											.setModelsSilently(this.editorObject
													.getModels());
									this.editorObject.dispatchChange();
									return true;
								}
							}
							if (target instanceof kemia.model.Bond) {
								var bond = target;
								if (this.bond_type) {
									if (this.bond_type.order != bond.order
											|| this.bond_type.stereo != bond.stereo
											|| bond.stereo != kemia.model.Bond.STEREO.NOT_STEREO) {
										this.editorObject
												.dispatchBeforeChange();
										this.replaceBond(target);
										this.editorObject
												.setModelsSilently(this.editorObject
														.getModels());
										this.editorObject.dispatchChange();
										return true;
									}
								} else {
									this.editorObject.dispatchBeforeChange();
									this.dragBond(e, bond);
									this.editorObject.dispatchChange();
									return true;
								}

								// else {
								// if (target._last_click) {
								// if ((goog.now() - target._last_click) < 1000)
								// {
								// this.editorObject.dispatchBeforeChange();
								// this.toggleBondType(target);
								// this.editorObject
								// .setModelsSilently(this.editorObject
								// .getModels());
								// this.editorObject.dispatchChange();
								// return true;
								// }
								// }
								// target._last_click = goog.now();
								// }
							}
						}, this);
	} else {
		if (this.bond_type) {
			this.editorObject.dispatchBeforeChange();
			this.createMolecule(kemia.controller.ReactionEditor
					.getMouseCoords(e));
			this.editorObject.setModelsSilently(this.editorObject.getModels());
			this.editorObject.dispatchChange();
			return true;
		}
	}
};

kemia.controller.plugins.BondEdit.prototype.dragBond = function(e, bond) {
	var center;
	if (bond.source.bonds.getValues().length == 1) {
		center = bond.target.coord;
	} else if (bond.target.bonds.getValues().length == 1) {
		center = bond.source.coord;
	}

	if (center) {
		var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
		d._center = center;
		var trans;
		if (this.editorObject.reactionRenderer.transform) {
			trans = this.editorObject.reactionRenderer.transform;
		} else {
			trans = this.editorObject.reactionRenderer.moleculeRenderer.transform;
		}
		d._transformed_center = trans.transformCoords( [ center ])[0];
		d._start = kemia.controller.ReactionEditor.getMouseCoords(e);
		d._prev_angle = goog.math.angle(d._transformed_center.x,
				d._transformed_center.y, d._start.x, d._start.y);
		d.bond = bond;
		d.editor = this.editorObject;

		d.start_x = e.screenX;
		d.start_y = e.screenY;
		d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {

			var screenAngle =  goog.math.angle(d.start_x, d.start_y, d.screenX,d.screenY)
			screenAngle = Math.round(screenAngle/10)*10;
			var sine= Math.sin(-goog.math.toRadians(screenAngle))
			var cosine= Math.cos(-goog.math.toRadians(screenAngle))
			d.bond.molecule.group.clear();

			var targX = d.bond.source.coord.x + (cosine)
			var targY = d.bond.source.coord.y+  (sine)
			d.bond.target.coord = new goog.math.Coordinate(targX, targY);
			d.editor.setModelsSilently(d.editor.getModels());

			
			/*

			//Previous implementation.
			
			d.bond.molecule.group.clear();
			d._initDeltaX = d._initDeltaX || d.deltaX;
			d._initDeltaY = d._initDeltaY || d.deltaY;
			var deltaX = d.deltaX - d._initDeltaX;
			var deltaY = d.deltaY - d._initDeltaY;
			var new_angle = goog.math.angle(d._transformed_center.x,
					d._transformed_center.y, d._start.x + deltaX, d._start.y
							+ deltaY);

			var delta_angle = new_angle - d._prev_angle;
			delta_angle = delta_angle - delta_angle % 30;
			d._prev_angle = d._prev_angle + delta_angle;
			var trans = kemia.graphics.AffineTransform
					.getRotateInstance(-goog.math.toRadians(delta_angle),
							d._center.x, d._center.y);
			var coords = trans.transformCoords( [ d.bond.source.coord,
					d.bond.target.coord ]);
			d.bond.source.coord = coords[0];
			d.bond.target.coord = coords[1];
			d.editor.setModelsSilently(d.editor.getModels());
			*/

		});
		d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
			d.dispose();
		});
		d.startDrag(e);
	}
};

kemia.controller.plugins.BondEdit.prototype.createMolecule = function(pos) {
	var trans;
	if (this.editorObject.reactionRenderer.transform) {
		trans = this.editorObject.reactionRenderer.transform;
	} else {
		trans = this.editorObject.reactionRenderer.moleculeRenderer.transform;
	}
	var coord = trans.createInverse().transformCoords( [ pos ])[0];
	var atom = new kemia.model.Atom("C", coord.x, coord.y);
	var molecule = new kemia.model.Molecule();
	molecule.addAtom(atom);
	molecule.sproutBond(atom, this.bond_type.order, this.bond_type.stereo);

	if (this.editorObject.getModels().length > 0) {
		var model = this.editorObject.getModels()[0];
		if (model instanceof kemia.model.Reaction) {
			model.addMolecule(molecule);
		} else {
			goog.array.concat(this.editorObject.getModels(), molecule);
		}
	} else {
		goog.array.concat(this.editorObject.getModels(), molecule);
	}
};

kemia.controller.plugins.BondEdit.prototype.toggleBondType = function(bond) {
	if (bond.stereo == kemia.model.Bond.STEREO.NOT_STEREO) {
		var order = kemia.model.Bond.ORDER.SINGLE;
		if (bond.order == kemia.model.Bond.ORDER.SINGLE) {
			order = kemia.model.Bond.ORDER.DOUBLE;
		} else if (bond.order == kemia.model.Bond.ORDER.DOUBLE) {
			order = kemia.model.Bond.ORDER.TRIPLE;
		}
		var new_bond = new kemia.model.Bond(bond.target, bond.source, order,
				bond.stereo);
		var molecule = bond.molecule;
		molecule.removeBond(bond);
		molecule.addBond(new_bond);
	}
};

kemia.controller.plugins.BondEdit.prototype.replaceBond = function(bond) {
	if (this.bond_type.stereo != kemia.model.Bond.STEREO.NOT_STEREO
			&& bond.stereo == this.bond_type.stereo) {
		// flip ends if replacing with the same stereo

		var new_bond = new kemia.model.Bond(bond.target, bond.source,
				this.bond_type.order, this.bond_type.stereo);
	} else {
		var new_bond = new kemia.model.Bond(bond.source, bond.target,
				this.bond_type.order, this.bond_type.stereo);
	}
	var molecule = bond.molecule;
	molecule.removeBond(bond);
	molecule.addBond(new_bond);
};

kemia.controller.plugins.BondEdit.prototype.highlightAtom = function(atom,
		opt_group) {

	return this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer
			.highlightOn(atom, 'green', opt_group);
};

kemia.controller.plugins.BondEdit.prototype.highlightBond = function(bond,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory
			.get(bond).highlightOn(bond, 'green', opt_group);
};

/**
 * reset to default state called when another plugin is made active
 */
kemia.controller.plugins.BondEdit.prototype.resetState = function() {
	this.bond_type = undefined;
}

/** @inheritDoc */
kemia.controller.plugins.BondEdit.prototype.queryCommandValue = function(
		command) {
	if (command == kemia.controller.plugins.BondEdit.COMMAND) {
		return this.bond_type;
	}
};
