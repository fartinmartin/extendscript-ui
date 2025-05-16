import { InstanceProps, InstanceType } from "../../lib/types";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
};

type Methods<T> = {
	[K in keyof T as K extends `on${string}` ? K : never]: T[K];
};

type Attributes<
	T extends new (...args: any[]) => any,
	K = _AddControlProperties,
> = Partial<InstanceProps<T> & { properties: K } & Methods<InstanceType<T>>>;

export type ScriptUIElementTagName = keyof ScriptUIElements;
export type ScriptUIElements = {
	// windows
	dialog: Attributes<typeof Window, _AddControlPropertiesWindow>;
	palette: Attributes<typeof Window, _AddControlPropertiesWindow>;
	// containers
	panel: Attributes<typeof Panel, _AddControlPropertiesPanel>;
	group: Attributes<typeof Group>;
	"tabbed-panel": Attributes<typeof TabbedPanel>;
	tab: Attributes<typeof Tab>;
	// controls
	button: Attributes<typeof Button>;
	checkbox: Attributes<typeof Checkbox>;
	image: Attributes<typeof Image>;
	"progress-bar": Attributes<typeof Progressbar>;
	"radio-button": Attributes<typeof RadioButton>;
	scrollbar: Attributes<typeof Scrollbar>;
	slider: Attributes<typeof Slider>;
	"edit-text": Attributes<typeof EditText, _AddControlPropertiesEditText>;
	"icon-button": Attributes<typeof IconButton, _AddControlPropertiesIconButton>;
	"static-text": Attributes<typeof StaticText, _AddControlPropertiesStaticText>;
	//
	// TODO: figure out how to render TreeView | ListBox | DropDownList
	// "tree-view": Attributes<typeof TreeView, _AddControlPropertiesTreeView>;
	// "list-box": Attributes<typeof ListBox, _AddControlPropertiesListBox>;
	// "dropdown-list": Attributes<
	// 	typeof DropDownList,
	// 	_AddControlPropertiesDropDownList
	// >;
	// "list-item": Attributes<typeof ListItem>;
	//
	"flash-player": Attributes<typeof FlashPlayer> & {
		movieToLoad?: string | File;
	};
};

export const SCRIPTUI_TAGS = [
	"dialog",
	"palette",
	"panel",
	"group",
	"tabbed-panel",
	"tab",
	"button",
	"checkbox",
	"image",
	"progress-bar",
	"radio-button",
	"scrollbar",
	"slider",
	"edit-text",
	"icon-button",
	"static-text",
	// "tree-view",
	// "list-box",
	// "dropdown-list",
	// "list-item",
	"flash-player",
] satisfies ScriptUIElementTagName[];
