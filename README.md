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
