// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { fs } from './fs';

import { host } from './host';
import * as explorer from './explorer';
import { shell, Shell, ShellResult, ShellHandler } from './shell';
import * as config from './components/config/config';
import { CheckPresentMessageMode, create as kubectlCreate } from './kubectl';
import { create as minikubeCreate, CheckPresentMode as MinikubeCheckPresentMode } from './components/clusterprovider/minikube/minikube';
import { create as draftCreate, CheckPresentMode as DraftCheckPresentMode } from './draft/draft';
import { installHelm, installDraft, installKubectl, installMinikube } from './components/installer/installer';
import { Errorable, failed, succeeded } from './errorable';

import { kubeChannel } from './kubeChannel';

import * as helmexec from './helm.exec';
import * as helm from './helm';
import { print } from 'util';
import { doesNotReject } from 'assert';

let {PythonShell} = require('python-shell')

const minikube = minikubeCreate(host, fs, shell, installDependencies);
const draft = draftCreate(host, fs, shell, installDependencies);
const kubectl = kubectlCreate(config.getKubectlVersioning(), host, fs, shell, installDependencies);


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "helloworld" is now active!');

        let options = {
            mode: 'binary',
            pythonPath: 'python3',
            scriptPath: '/home/t-maliao/vscode-rampup/helloworld/src'
          };
        let pyshell = new PythonShell('sample.py', options);

        pyshell.stdout.on('data', function (data) {
            console.log(data.toString());
        });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable1 = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showWarningMessage('Hello World!');
	});

	let disposable2 = vscode.commands.registerCommand('extension.currTime', () => {
		let currTime = Date();

		// Display a message box with current date/time
		vscode.window.showInformationMessage(currTime);
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);

	const treeProvider = explorer.create(kubectl, host);

    vscode.window.registerTreeDataProvider('extension.vsHydrateExplorer', treeProvider);
    vscode.commands.registerCommand('extension.vsHydrateRefreshExplorer', () => treeProvider.refresh());
    // vscode.commands.registerCommand('extension.vsHydrateSelectCluster', selectCluster);
}

// this method is called when your extension is deactivated
export function deactivate() {}
export async function installDependencies() {
    // TODO: gosh our binchecking is untidy
    const gotKubectl = await kubectl.checkPresent(CheckPresentMessageMode.Silent);
    const gotHelm = helmexec.ensureHelm(helmexec.EnsureMode.Silent);
    const gotDraft = await draft.checkPresent(DraftCheckPresentMode.Silent);
	const gotMinikube = await minikube.checkPresent(MinikubeCheckPresentMode.Silent);
	
    const installPromises = [
        installDependency("kubectl", gotKubectl, installKubectl),
        installDependency("Helm", gotHelm, installHelm),
        installDependency("Draft", gotDraft, installDraft),
    ];

    if (!config.getUseWsl()) {
        // TODO: Install Win32 Minikube
        installPromises.push(
            installDependency("Minikube", gotMinikube, (shell: Shell) => {
                return installMinikube(shell, null);
            }));
    }
    await Promise.all(installPromises);

    kubeChannel.showOutput("Done");
}

async function installDependency(name: string, alreadyGot: boolean, installFunc: (shell: Shell) => Promise<Errorable<null>>): Promise<void> {
    if (alreadyGot) {
        kubeChannel.showOutput(`Already got ${name}...`);
    } else {
        kubeChannel.showOutput(`Installing ${name}...`);
        const result = await installFunc(shell);
        if (failed(result)) {
            kubeChannel.showOutput(`Unable to install ${name}: ${result.error[0]}`);
        }
    }
}