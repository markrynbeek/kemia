goog.provide('kemia.controller.plugins.ClearEditor');

goog.require('kemia.controller.Plugin');
goog.require('goog.functions');

// goog.exportSymbol('kemia.controller.plugins.ClearEditor.COMMAND',
// kemia.controller.plugins.ClearEditor.COMMAND);

/**
 * simple Plugin for clearing editor.
 * 
 * @constructor
 * @extends {kemia.controller.Plugin}
 */
kemia.controller.plugins.ClearEditor = function() {
	kemia.controller.Plugin.call(this);
};
goog.inherits(kemia.controller.plugins.ClearEditor, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.ClearEditor',
		kemia.controller.plugins.ClearEditor);

/** The clear command. */
kemia.controller.plugins.ClearEditor.COMMAND = 'clearEditor';

/** @inheritDoc */
kemia.controller.plugins.ClearEditor.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.ClearEditor.COMMAND);

/** @inheritDoc */
kemia.controller.plugins.ClearEditor.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.ClearEditor.COMMAND;
};

/**
 * clears the editor.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.ClearEditor.prototype.execCommandInternal = function(
		command) {
	try {
		this.editorObject.dispatchBeforeChange();
		this.editorObject.clear();

	} catch (e) {
		this.logger.info(e);
	}
};

/** @inheritDoc */
kemia.controller.plugins.ClearEditor.prototype.isSilentCommand = goog.functions.FALSE;
