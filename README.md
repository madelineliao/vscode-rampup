# Ramping up on VS Code
Repo containing sample VS Code extensions. 

I'm keeping track of my exploration of the VS Code extensions model in this repository. The topics I've gone through are listed below in chronological order, with the current topic of exploration listed at the bottom of the page.

## Running Hello World sample
Instructions summarized from https://code.visualstudio.com/api/get-started/your-first-extension.

Outside of the `helloworld` directory, run `code ./helloWorld`, which will open a VS Code window.

Press `F5`, which will open another new window.

In this new window, press `Ctrl+Shift+P` to open the Command Palette, and type `Hello World` and press `Enter`.

A dialog displaying the message will appear!

## Running with tests
You can add tests to `src/extension.test.ts`.

Click the debugging icon tab on the sidebar, then click the dropdown menu next to the green run button, selecting "Extension Tests". Then, when you press `F5` to run `Debug: Start`, the extension will be launched and your tests will be run. The output will be printed to the Debug Console.

## Creating a new view
In this example, I've added a new view (a view is one of the icons on the sidebar that displays certain filetrees/data/other info). View containers (the icons on the sidebar) can be added in `contributes.viewsContainers` in `package.json`. The View that results must be populated with data by registering a TreeDataProvider. (https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider).

I've added a view represented by an icon of some cherries.

## Populating a view with data from a TreeDataProvider
I'm currently working on populating the view container mentioned in the previous section. Using the Kubernetes VS Code extension (https://github.com/Azure/vscode-kubernetes-tools) as a guide, I'm exploring how to display the user's Kubernetes clusters in the view container.
### Update: Tuesday 7/2/19
Was able to get the new view to display the user's Kubernetes clusters. Bug: when switching to the Kubernetes extension view then switching back to the new view, the clusters are no longer displayed. (Might have to do with the fact that I based my code off of the Kubernetes extension code, so that overlap may be causing some problems?)

### Update: Wednesday 7/3/19
Disabling the Kubernetes extension fixes the problem described above. The two seem to interact with each other somehow; when both are enabled, duplicate "refresh" icons appear in each view. However, this does not occur when the Kubernetes extension is disabled. Currently exploring why that is.

### Update: Friday 7/5/19
I fixed the problem listed above. I was using the same name for my new view ID as that of the Kubernetes VS Code extension. Once I changed the ID I was using, everything worked fine. Based on this, I'm assuming that the extension view ID has to be unique (though I'm not sure how one would check this across ALL other VS Code extensions available - perhaps this is only an issue in the extension development host that VS Code has for testing?).

## Currently working on: Calling a Python script from Typescript (Monday 7/8/19)
By using the `npm` module `python-shell`, I was able to run a sample Python script and return data to the Typescript file. Through the module, communication between Typescript and Python is possible. I'm currently working on getting the module to work with Hydrate's dry-run, which outputs the contents of the generated `component.yaml` to the terminal. I'm trying to figure out how to ignore the other print statements in Hydrate and isolate the `component.yaml` output when using `python-shell` (since `python-shell` sends the output from the Python script back to Typescript, it will send all print statements and output to `sys.stdout`, so I'm working on isolating the only output we care about, namely, the `component.yaml` contents).

# Resources
Resources I read through and referenced.

## VS Code API
A set of JavaScript APIs that can be invoked in your VS Code extensions can be found here: https://code.visualstudio.com/api/references/vscode-api.

## Kubernetes VS Code Extension
A VS Code extension that helps developers working with Kubernetes applications.
https://github.com/Azure/vscode-kubernetes-tools
