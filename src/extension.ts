import {window, workspace} from 'vscode';
import *  as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("allfileopen.openwithcommand", () => {
		execute();
});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

async function execute(){
	const config = workspace.getConfiguration("allfileopen");
	const extension = config.get<string>("extensionFileSearch");
    const commands = config.get<string[]>("runcommands");
    
    if(extension === undefined){return;}
    if(commands === undefined){return;}
    
    let files = await workspace.findFiles(`**/*.${extension}`);
    for (let uri of files)
    {
        await eachFiles(uri, commands);
    }
}

async function eachFiles(uri:vscode.Uri, commands:string[])
{
    try
    {
        // console.log(`Open${uri.path}`);
        await window.showTextDocument(uri);
        const editor = window.activeTextEditor;
        // if(editor !== undefined)
        // {
        //     console.log(`Opened${editor.document.fileName}`);
        // }
    }
    catch(e){showError(`File Open Error:${uri.path}`);return;}
    await runCommands(commands);   
}

async function runCommands(runCommands:string[])
{
    for(let runCommand of runCommands) 
    {
        if(runCommand === "") {return; }
        try
        {
            // console.log(`run${runCommand}`);
            await vscode.commands.executeCommand(runCommand);
            // console.log(`ran${runCommand}`);
        }
        catch(e)
        {
            showError(`Run Command Error:${runCommand}`);
            return false;
        }    
    }
    return;
}

function showError(message:string)
{
    vscode.window.showErrorMessage(message);
}