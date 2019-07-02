# vscode-rampup
Repo containing sample VS Code extensions.

## Run Hello World sample
Instructions summarized from https://code.visualstudio.com/api/get-started/your-first-extension.

Outside of the `helloworld` directory, run `code ./helloWorld`, which will open a VS Code window.

Press `F5`, which will open another new window.

In this new window, press `Ctrl+Shift+P` to open the Command Palette, and type `Hello World` and press `Enter`.

A dialog displaying the message will appear!

## Run with tests
You can add tests to `src/extension.test.ts`.

Click the debugging icon tab on the sidebar, then click the dropdown menu next to the green run button, selecting "Extension Tests". Then, when you press `F5` to run `Debug: Start`, the extension will be launched and your tests will be run. The output will be printed to the Debug Console.

## Creating a New View
In this example, I've added a new view (a view is one of the icons on the sidebar that displays certain filetrees/data/other info). View containers (the icons on the sidebar) can be added in `contributes.viewsContainers` in `package.json`. The View that results must be populated with data by registering a TreeDataProvider. (https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider).

I've added a view represented by an icon of some cherries.

## Currently Exploring: Populating a View with Data from a TreeDataProvider
I'm currently working on populating the view container mentioned in the previous section. Using the Kubernetes VS Code extension (https://github.com/Azure/vscode-kubernetes-tools) as a guide, I'm exploring how to display the users' Kubernetes clusters in the view container.

## VS Code API
A set of JavaScript APIs that can be invoked in your VS Code extensions can be found here: https://code.visualstudio.com/api/references/vscode-api.
