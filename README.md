# Azure DevOps Plugin for enhance Delivery plan capabilities

##  Prerequisites

Download and install the following tools
1. [Visual Studio Code](https://code.visualstudio.com/download)
2. The [tfx-cli](https://www.npmjs.com/package/tfx-cli) npm package
3. The [webpack](https://www.npmjs.com/package/webpack) npm package
4. The [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) npm package


## Dependencies

The repository depends on a few Azure DevOps packages:

- [azure-devops-extension-sdk](https://github.com/Microsoft/azure-devops-extension-sdk): Required module for Azure DevOps extensions which allows communication between the host page and the extension iframe.
- [azure-devops-extension-api](https://github.com/Microsoft/azure-devops-extension-api): Contains REST client libraries for the various Azure DevOps feature areas.
- [azure-devops-ui](https://developer.microsoft.com/azure-devops): UI library containing the React components used in the Azure DevOps web UI.

Some external dependencies:
- `React` - Is used to render the UI.
- `TypeScript` - It written in TypeScript and compiled to JavaScript
- `SASS` - Extension samples are styled using SASS (which is compiled to CSS and delivered in webpack js bundles).
- `webpack` - Is used to gather dependencies into a single javascript bundle for each sample.

## Building the project

Just install:
    npm install

### Launch project to debug against Azure DevOps    
1. npm run start:dev
2. java LocalHTTPServer.java (env X_COOKIE="", copy from browser for dev.azure.com) 
3. In VS Code, press **F5** to start debugging (making sure the webpack-dev-server is still running).

Once it starts up, you will have to go through the steps of allowing the `localhost:3000` certificate again and log into your Azure DevOps account. From now on, if you leave this window open, the debugger will reattach instead of starting a clean instance each time.

Once you are logged in to Azure DevOps, your extension should be running. Set a breakpoint in a method in VS Code and you should see that breakpoint hit when that method executes.

## Release 
### Dev
1. Uprates vss-extension.json
    - version
    - publisher
2. npm run package:dev  
3. tfx extension publish --manifest-globs vss-extension.json --overrides-file configs/dev.json --token {YOUR_TOKEN}
