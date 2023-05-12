// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


function moveCaretsToLeft(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	editor.selections = editor.selections.map(s => new vscode.Selection(s.end, s.start));
}

function moveCaretsToRight(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	editor.selections = editor.selections.map(s => new vscode.Selection(s.start, s.end));
}

function selectionIsInverted(s: vscode.Selection) {
	return s.active.isBefore(s.anchor);
}

function selectionIsNonInverted(s: vscode.Selection) {
	return s.active.isAfter(s.anchor);
}

function setContext(propertyName: string, value: boolean) {
	vscode.commands.executeCommand('setContext', propertyName, value);
}

vscode.window.onDidChangeTextEditorSelection(
	(e: vscode.TextEditorSelectionChangeEvent) => {
		setContext('existsInvertedSelection', e.selections.some(s => selectionIsInverted(s)));
		setContext('existsNonInvertedSelection', e.selections.some(s => selectionIsNonInverted(s)));
	}
);

interface VanillaCommand {
	name: string;
	func: (p1: vscode.TextEditor, p2: vscode.TextEditorEdit) => void;
}

function registerCommands(extension_id: string, context: vscode.ExtensionContext, zeList: VanillaCommand[]) {
	zeList.forEach(z => vscode.commands.registerTextEditorCommand(extension_id + '.' + z.name, z.func));
}

export function activate(context: vscode.ExtensionContext) {
	registerCommands(
		'karmchenki-selection-tunneler',
		context,
		[
			{ name: 'moveCaretsToLeft', func: moveCaretsToLeft },
			{ name: 'moveCaretsToRight', func: moveCaretsToRight }
		]
	);
}

export function deactivate() { }
