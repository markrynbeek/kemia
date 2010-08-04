goog.provide('kemia.controller.ToolbarFactory');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.string.Unicode');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Container.Orientation');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.Option');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarColorMenuButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.userAgent');
goog.require('goog.ui.LabelInput');

goog.exportSymbol('kemia.controller.ToolbarFactory.makeButton', kemia.controller.ToolbarFactory.makeButton);


/**
 * Takes a font spec (e.g. "Arial, Helvetica, sans-serif") and returns the
 * primary font name, normalized to lowercase (e.g. "arial").
 * 
 * @param {string}
 *            fontSpec Font specification.
 * @return {string} The primary font name, in lowercase.
 */
kemia.controller.ToolbarFactory.getPrimaryFont = function(fontSpec) {
	var i = fontSpec.indexOf(',');
	var fontName = (i != -1 ? fontSpec.substring(0, i) : fontSpec)
			.toLowerCase();
	// Strip leading/trailing quotes from the font name (bug 1050118).
	return goog.string.stripQuotes(fontName, '"\'');
};

/**
 * Bulk-adds fonts to the given font menu button. The argument must be an array
 * of font descriptor objects, each of which must have the following attributes:
 * <ul>
 * <li>{@code caption} - Caption to show in the font menu (e.g. 'Tahoma')
 * <li>{@code value} - Value for the corresponding 'font-family' CSS style
 * (e.g. 'Tahoma, Arial, sans-serif')
 * </ul>
 * 
 * @param {!goog.ui.Select}
 *            button Font menu button.
 * @param {!Array.<{caption: string, value: string}>} fonts Array of font
 *            descriptors.
 */
kemia.controller.ToolbarFactory.addFonts = function(button, fonts) {
	goog.array.forEach(fonts, function(font) {
		kemia.controller.ToolbarFactory.addFont(button, font.caption,
				font.value);
	});
};

/**
 * Adds a menu item to the given font menu button. The first font listed in the
 * {@code value} argument is considered the font ID, so adding two items whose
 * CSS style starts with the same font may lead to unpredictable results.
 * 
 * @param {!goog.ui.Select}
 *            button Font menu button.
 * @param {string}
 *            caption Caption to show for the font menu.
 * @param {string}
 *            value Value for the corresponding 'font-family' CSS style.
 */
kemia.controller.ToolbarFactory.addFont = function(button, caption, value) {
	// The font ID is the first font listed in the CSS style, normalized to
	// lowercase.
	var id = kemia.controller.ToolbarFactory.getPrimaryFont(value);

	// Construct the option, and add it to the button.
	var option = new goog.ui.Option(caption, value, button.dom_);
	option.setId(id);
	button.addItem(option);

	// Captions are shown in their own font.
	option.getContentElement().style.fontFamily = value;
};

/**
 * Bulk-adds font sizes to the given font size menu button. The argument must be
 * an array of font size descriptor objects, each of which must have the
 * following attributes:
 * <ul>
 * <li>{@code caption} - Caption to show in the font size menu (e.g. 'Huge')
 * <li>{@code value} - Value for the corresponding HTML font size (e.g. 6)
 * </ul>
 * 
 * @param {!goog.ui.Select}
 *            button Font size menu button.
 * @param {!Array.<{caption: string, value:number}>} sizes Array of font size
 *            descriptors.
 */
kemia.controller.ToolbarFactory.addFontSizes = function(button, sizes) {
	goog.array.forEach(sizes, function(size) {
		kemia.controller.ToolbarFactory.addFontSize(button, size.caption,
				size.value);
	});
};

/**
 * Adds a menu item to the given font size menu button. The {@code value}
 * argument must be a legacy HTML font size in the 0-7 range.
 * 
 * @param {!goog.ui.Select}
 *            button Font size menu button.
 * @param {string}
 *            caption Caption to show in the font size menu.
 * @param {number}
 *            value Value for the corresponding HTML font size.
 */
kemia.controller.ToolbarFactory.addFontSize = function(button, caption,
		value) {
	// Construct the option, and add it to the button.
	var option = new goog.ui.Option(caption, value, button.dom_);
	option.setId(caption);
	button.addItem(option);

	// Adjust the font size of the menu item and the height of the checkbox
	// element after they've been rendered by addItem(). Captions are shown in
	// the corresponding font size, and lining up the checkbox is tricky.
	var content = option.getContentElement();
	content.style.fontSize = kemia.controller.ToolbarFactory
			.getPxFromLegacySize(value) + 'px';
	content.firstChild.style.height = '1.1em';
};

/**
 * Converts a legacy font size specification into an equivalent pixel size. For
 * example, {@code &lt;font size="6"&gt;} is {@code font-size: 32px;}, etc.
 * 
 * @param {number}
 *            fontSize Legacy font size spec in the 0-7 range.
 * @return {number} Equivalent pixel size.
 */
kemia.controller.ToolbarFactory.getPxFromLegacySize = function(fontSize) {
	return kemia.controller.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_[fontSize] || 10;
};

/**
 * Converts a pixel font size specification into an equivalent legacy size. For
 * example, {@code font-size: 32px;} is {@code &lt;font size="6"&gt;}, etc. If
 * the given pixel size doesn't exactly match one of the legacy sizes, -1 is
 * returned.
 * 
 * @param {number}
 *            px Pixel font size.
 * @return {number} Equivalent legacy size spec in the 0-7 range, or -1 if none
 *         exists.
 */
kemia.controller.ToolbarFactory.getLegacySizeFromPx = function(px) {
	// Use lastIndexOf to get the largest legacy size matching the pixel size
	// (most notably returning 1 instead of 0 for 10px).
	return goog.array.lastIndexOf(
			kemia.controller.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_, px);
};

/**
 * Map of legacy font sizes (0-7) to equivalent pixel sizes.
 * 
 * @type {Array.<number>}
 * @private
 */
kemia.controller.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_ = [ 10, 10, 13, 16,
		18, 24, 32, 48 ];

/**
 * Bulk-adds format options to the given "Format block" menu button. The
 * argument must be an array of format option descriptor objects, each of which
 * must have the following attributes:
 * <ul>
 * <li>{@code caption} - Caption to show in the menu (e.g. 'Minor heading')
 * <li>{@code command} - Corresponding {@link goog.dom.TagName} (e.g. 'H4')
 * </ul>
 * 
 * @param {!goog.ui.Select}
 *            button "Format block" menu button.
 * @param {!Array.<{caption: string, command: string}>} formats Array of format
 *            option descriptors.
 */
kemia.controller.ToolbarFactory.addFormatOptions = function(button, formats) {
	goog.array.forEach(formats, function(format) {
		kemia.controller.ToolbarFactory.addFormatOption(button,
				format.caption, format.command);
	});
};

/**
 * Adds a menu item to the given "Format block" menu button.
 * 
 * @param {!goog.ui.Select}
 *            button "Format block" menu button.
 * @param {string}
 *            caption Caption to show in the menu.
 * @param {goog.dom.TagName}
 *            tag Corresponding block format tag.
 */
kemia.controller.ToolbarFactory.addFormatOption = function(button, caption,
		tag) {
	// Construct the option, and add it to the button.
	// TODO: Create boring but functional menu item for now...
	var option = new goog.ui.Option(button.dom_.createDom(goog.dom.TagName.DIV,
			null, caption), tag, button.dom_);
	option.setId(tag);
	button.addItem(option);
};

/**
 * Creates a {@link goog.ui.Toolbar} containing the specified set of toolbar
 * buttons, and renders it into the given parent element. Each item in the
 * {@code items} array must a {@link goog.ui.Control}.
 * 
 * @param {!Array.<goog.ui.Control>} items Toolbar items; each must be a
 *            {@link goog.ui.Control}.
 * @param {!Element}
 *            elem Toolbar parent element.
 * @param {boolean=}
 *            opt_isRightToLeft Whether the editor chrome is right-to-left;
 *            defaults to the directionality of the toolbar parent element.
 * @return {!goog.ui.Toolbar} Editor toolbar, rendered into the given parent
 *         element.
 */
kemia.controller.ToolbarFactory.makeToolbar = function(items, elem,
		opt_isRightToLeft) {
	var domHelper = goog.dom.getDomHelper(elem);

	// Create an empty horizontal toolbar using the default renderer.
	var toolbar = new goog.ui.Toolbar(goog.ui.ToolbarRenderer.getInstance(),
			goog.ui.Container.Orientation.HORIZONTAL, domHelper);

	// Optimization: Explicitly test for the directionality of the parent
	// element here, so we can set it for both the toolbar and its children,
	// saving a lot of expensive calls to goog.style.isRightToLeft() during
	// rendering.
	var isRightToLeft = opt_isRightToLeft || goog.style.isRightToLeft(elem);
	toolbar.setRightToLeft(isRightToLeft);

	// Optimization: Set the toolbar to non-focusable before it is rendered,
	// to avoid creating unnecessary keyboard event handler objects.
	toolbar.setFocusable(false);

	for ( var i = 0, button; button = items[i]; i++) {
		// Optimization: Set the button to non-focusable before it is rendered,
		// to avoid creating unnecessary keyboard event handler objects. Also
		// set
		// the directionality of the button explicitly, to avoid expensive calls
		// to goog.style.isRightToLeft() during rendering.
		button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
		button.setRightToLeft(isRightToLeft);
		toolbar.addChild(button, true);
	}

	toolbar.render(elem);
	return toolbar;
};

/**
 * Creates a toolbar button with the given ID, tooltip, and caption. Applies any
 * custom CSS class names to the button's caption element.
 * 
 * @param {string}
 *            id Button ID; must equal a {@link goog.editor.Command} for
 *            built-in buttons, anything else for custom buttons.
 * @param {string}
 *            tooltip Tooltip to be shown on hover.
 * @param {goog.ui.ControlContent}
 *            caption Button caption.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the caption element.
 * @param {goog.ui.ButtonRenderer=}
 *            opt_renderer Button renderer; defaults to
 *            {@link goog.ui.ToolbarButtonRenderer} if unspecified.
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!goog.ui.Button} A toolbar button.
 */
kemia.controller.ToolbarFactory.makeButton = function(id, tooltip, caption,
		opt_classNames, opt_renderer, opt_domHelper) {
	var button = new goog.ui.ToolbarButton(kemia.controller.ToolbarFactory
			.createContent_(caption, opt_classNames, opt_domHelper),
			opt_renderer, opt_domHelper);
	button.setId(id);
	button.setTooltip(tooltip);
	return button;
};

/**
 * Creates a toggle button with the given ID, tooltip, and caption. Applies any
 * custom CSS class names to the button's caption element. The button returned
 * has checkbox-like toggle semantics.
 * 
 * @param {string}
 *            id Button ID; must equal a {@link goog.editor.Command} for
 *            built-in buttons, anything else for custom buttons.
 * @param {string}
 *            tooltip Tooltip to be shown on hover.
 * @param {goog.ui.ControlContent}
 *            caption Button caption.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the caption element.
 * @param {goog.ui.ButtonRenderer=}
 *            opt_renderer Button renderer; defaults to
 *            {@link goog.ui.ToolbarButtonRenderer} if unspecified.
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!goog.ui.Button} A toggle button.
 */
kemia.controller.ToolbarFactory.makeToggleButton = function(id, tooltip,
		caption, opt_classNames, opt_renderer, opt_domHelper) {
	var button = kemia.controller.ToolbarFactory.makeButton(id, tooltip,
			caption, opt_classNames, opt_renderer, opt_domHelper);
	button.setSupportedState(goog.ui.Component.State.CHECKED, true);
	return button;
};

/**
 * Creates a menu button with the given ID, tooltip, and caption. Applies any
 * custom CSS class names to the button's caption element. The button returned
 * doesn't have an actual menu attached; use {@link goog.ui.MenuButton#setMenu}
 * to attach a {@link goog.ui.Menu} to the button.
 * 
 * @param {string}
 *            id Button ID; must equal a {@link goog.editor.Command} for
 *            built-in buttons, anything else for custom buttons.
 * @param {string}
 *            tooltip Tooltip to be shown on hover.
 * @param {goog.ui.ControlContent}
 *            caption Button caption.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the caption element.
 * @param {goog.ui.ButtonRenderer=}
 *            opt_renderer Button renderer; defaults to
 *            {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!goog.ui.MenuButton} A menu button.
 */
kemia.controller.ToolbarFactory.makeMenuButton = function(id, tooltip,
		caption, opt_classNames, opt_renderer, opt_domHelper) {
	var button = new goog.ui.ToolbarMenuButton(
			kemia.controller.ToolbarFactory.createContent_(caption,
					opt_classNames, opt_domHelper), null, opt_renderer,
			opt_domHelper);
	button.setId(id);
	button.setTooltip(tooltip);
	return button;
};

/**
 * Creates a select button with the given ID, tooltip, and caption. Applies any
 * custom CSS class names to the button's root element. The button returned
 * doesn't have an actual menu attached; use {@link goog.ui.Select#setMenu} to
 * attach a {@link goog.ui.Menu} containing {@link goog.ui.Option}s to the
 * select button.
 * 
 * @param {string}
 *            id Button ID; must equal a {@link goog.editor.Command} for
 *            built-in buttons, anything else for custom buttons.
 * @param {string}
 *            tooltip Tooltip to be shown on hover.
 * @param {goog.ui.ControlContent}
 *            caption Button caption; used as the default caption when nothing
 *            is selected.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the button's root
 *            element.
 * @param {goog.ui.MenuButtonRenderer=}
 *            opt_renderer Button renderer; defaults to
 *            {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!goog.ui.Select} A select button.
 */
kemia.controller.ToolbarFactory.makeSelectButton = function(id, tooltip,
		caption, opt_classNames, opt_renderer, opt_domHelper) {
	var button = new goog.ui.ToolbarSelect(null, null, opt_renderer,
			opt_domHelper);
	if (opt_classNames) {
		// Unlike the other button types, for goog.ui.Select buttons we apply
		// the
		// extra class names to the root element, because for select buttons the
		// caption isn't stable (as it changes each time the selection changes).
		goog.array.forEach(opt_classNames.split(/\s+/), button.addClassName,
				button);
	}
	button.addClassName(goog.getCssName('goog-toolbar-select'));
	button.setDefaultCaption(caption);
	button.setId(id);
	button.setTooltip(tooltip);
	return button;
};

/**
 * Creates a color menu button with the given ID, tooltip, and caption. Applies
 * any custom CSS class names to the button's caption element. The button is
 * created with a default color menu containing standard color palettes.
 * 
 * @param {string}
 *            id Button ID; must equal a {@link goog.editor.Command} for
 *            built-in toolbar buttons, but can be anything else for custom
 *            buttons.
 * @param {string}
 *            tooltip Tooltip to be shown on hover.
 * @param {goog.ui.ControlContent}
 *            caption Button caption.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the caption element.
 * @param {goog.ui.ColorMenuButtonRenderer=}
 *            opt_renderer Button renderer; defaults to
 *            {@link goog.ui.ToolbarColorMenuButtonRenderer} if unspecified.
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!goog.ui.ColorMenuButton} A color menu button.
 */
kemia.controller.ToolbarFactory.makeColorMenuButton = function(id, tooltip,
		caption, opt_classNames, opt_renderer, opt_domHelper) {
	var button = new goog.ui.ToolbarColorMenuButton(
			kemia.controller.ToolbarFactory.createContent_(caption,
					opt_classNames, opt_domHelper), null, opt_renderer,
			opt_domHelper);
	button.setId(id);
	button.setTooltip(tooltip);
	return button;
};

/**
 * Creates a new DIV that wraps a button caption, optionally applying CSS class
 * names to it. Used as a helper function in button factory methods.
 * 
 * @param {goog.ui.ControlContent}
 *            caption Button caption.
 * @param {string=}
 *            opt_classNames CSS class name(s) to apply to the DIV that wraps
 *            the caption (if any).
 * @param {goog.dom.DomHelper=}
 *            opt_domHelper DOM helper, used for DOM creation; defaults to the
 *            current document if unspecified.
 * @return {!Element} DIV that wraps the caption.
 * @private
 */
kemia.controller.ToolbarFactory.createContent_ = function(caption,
		opt_classNames, opt_domHelper) {
	// FF2 doesn't like empty DIVs, especially when rendered right-to-left.
	if ((!caption || caption == '') && goog.userAgent.GECKO
			&& !goog.userAgent.isVersion('1.9a')) {
		caption = goog.string.Unicode.NBSP;
	}
	return (opt_domHelper || goog.dom.getDomHelper()).createDom(
			goog.dom.TagName.DIV, opt_classNames ? {
				'class' : opt_classNames
			} : null, caption);
};
