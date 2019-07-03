"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs_1 = require("./fs");
const host_1 = require("./host");
const explorer = require("./explorer");
const shell_1 = require("./shell");
const config = require("./components/config/config");
const kubectl_1 = require("./kubectl");
const minikube_1 = require("./components/clusterprovider/minikube/minikube");
const draft_1 = require("./draft/draft");
const installer_1 = require("./components/installer/installer");
const errorable_1 = require("./errorable");
const kubeChannel_1 = require("./kubeChannel");
const helmexec = require("./helm.exec");
const minikube = minikube_1.create(host_1.host, fs_1.fs, shell_1.shell, installDependencies);
const draft = draft_1.create(host_1.host, fs_1.fs, shell_1.shell, installDependencies);
const kubectl = kubectl_1.create(config.getKubectlVersioning(), host_1.host, fs_1.fs, shell_1.shell, installDependencies);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');
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
    const treeProvider = explorer.create(kubectl, host_1.host);
    vscode.window.registerTreeDataProvider('extension.vsKubernetesTestExplorer', treeProvider);
    vscode.commands.registerCommand('extension.vsKubernetesRefreshTestExplorer', () => treeProvider.refresh());
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function installDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: gosh our binchecking is untidy
        const gotKubectl = yield kubectl.checkPresent(kubectl_1.CheckPresentMessageMode.Silent);
        const gotHelm = helmexec.ensureHelm(helmexec.EnsureMode.Silent);
        const gotDraft = yield draft.checkPresent(draft_1.CheckPresentMode.Silent);
        const gotMinikube = yield minikube.checkPresent(minikube_1.CheckPresentMode.Silent);
        const installPromises = [
            installDependency("kubectl", gotKubectl, installer_1.installKubectl),
            installDependency("Helm", gotHelm, installer_1.installHelm),
            installDependency("Draft", gotDraft, installer_1.installDraft),
        ];
        if (!config.getUseWsl()) {
            // TODO: Install Win32 Minikube
            installPromises.push(installDependency("Minikube", gotMinikube, (shell) => {
                return installer_1.installMinikube(shell, null);
            }));
        }
        yield Promise.all(installPromises);
        kubeChannel_1.kubeChannel.showOutput("Done");
    });
}
exports.installDependencies = installDependencies;
function installDependency(name, alreadyGot, installFunc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (alreadyGot) {
            kubeChannel_1.kubeChannel.showOutput(`Already got ${name}...`);
        }
        else {
            kubeChannel_1.kubeChannel.showOutput(`Installing ${name}...`);
            const result = yield installFunc(shell_1.shell);
            if (errorable_1.failed(result)) {
                kubeChannel_1.kubeChannel.showOutput(`Unable to install ${name}: ${result.error[0]}`);
            }
        }
    });
}
//# sourceMappingURL=extension.js.map