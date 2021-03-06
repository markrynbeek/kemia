goog.provide("kemia.controller.plugins.SmilesDialog");
goog.require("goog.ui.editor.AbstractDialog");

/**
 * Creates a dialog for the user to enter the SMILES of a compound to insert.
 * 
 * @param {goog.dom.DomHelper}
 *            dom DomHelper to be used to create the dialog's DOM structure.
 * @constructor
 * @extends {goog.ui.editor.AbstractDialog}
 */
kemia.controller.plugins.SmilesDialog = function(dom) {
	kemia.controller.plugins.AbstractDialog.call(this, dom);
};
goog.inherits(kemia.controller.plugins.SmilesDialog,
		kemia.controller.plugins.AbstractDialog);
goog.exportSymbol('kemia.controller.plugins.SmilesDialog', kemia.controller.plugins.SmilesDialog);

/** @inheritDoc */
kemia.controller.plugins.SmilesDialog.prototype.createDialogControl = function() {
	var builder = new kemia.controller.plugins.AbstractDialog.Builder(this);
	/** @desc Title of the dialog. */
	var MSG_EXAMPLE_DIALOG_TITLE = goog.getMsg('Paste SMILES');
	// Add a custom title and content.
	builder.setTitle(MSG_EXAMPLE_DIALOG_TITLE)
			.setContent(this.createContent_());
	return builder.build();
};
/**
 * Input element where the user will type the image URL.
 * 
 * @type {Element}
 * @private
 */
kemia.controller.plugins.SmilesDialog.prototype.input_;
/**
 * Creates the DOM structure that makes up the dialog's content area.
 * 
 * @return {Element} The DOM structure that makes up the dialog's content area.
 * @private
 */
kemia.controller.plugins.SmilesDialog.prototype.createContent_ = function() {
	this.input_ = this.dom.$dom(goog.dom.TagName.INPUT, {
		size : 25,
		value : 'http://'
	});
	/** @desc Prompt telling the user to enter a url */
	var MSG_EXAMPLE_DIALOG_PROMPT = goog
			.getMsg('Enter the SMILES for the structure to paste into drawing');
	return this.dom.$dom(goog.dom.TagName.DIV, null, [
			MSG_EXAMPLE_DIALOG_PROMPT, this.input_ ]);
};

/**
 * Returns the image URL typed into the dialog's input.
 * 
 * @return {?string} The SMILES currently typed into the dialog's input.
 * @private
 */
kemia.controller.plugins.SmilesDialog.prototype.getSmiles_ = function() {
	return this.input_ && this.input_.value;
};

/**
 * Creates and returns the event object to be used when dispatching the OK event
 * to listeners, or returns null to prevent the dialog from closing.
 * 
 * @param {goog.events.Event}
 *            e The event object dispatched by the wrapped dialog.
 * @return {goog.events.Event} The event object to be used when dispatching the
 *         OK event to listeners.
 * @protected
 * @override
 */
kemia.controller.plugins.SmilesDialog.prototype.createOkEvent = function(e) {
	var smiles = this.getSmiles_();
	if (url) {
		var event = new goog.events.Event(
				kemia.controller.plugins.AbstractDialog.EventType.OK);
		// Add the URL to the event.
		event.url = url;
		return event;
	} else {
		/** @desc Error message telling the user why their input was rejected. */
		var MSG_EXAMPLE_DIALOG_ERROR = goog
				.getMsg('You must input an image URL');
		this.dom.getWindow().alert(MSG_EXAMPLE_DIALOG_ERROR);
		return null; // Prevents the dialog from closing.
	}
};
