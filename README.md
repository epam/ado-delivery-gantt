# Azure DevOps Plugin for enhance Delivery plan capabilities

##  Prerequisites

Download and install the following tools
1. [Visual Studio Code](https://code.visualstudio.com/download)
2. node version 19.6.0 or greater
3. The [tfx-cli](https://www.npmjs.com/package/tfx-cli) npm package
4. The [webpack](https://www.npmjs.com/package/webpack) npm package
5. The [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) npm package


## Dependencies

The repository depends on a few Azure DevOps packages:

- [azure-devops-extension-sdk](https://github.com/Microsoft/azure-devops-extension-sdk): Required module for Azure DevOps extensions which allows communication between the host page and the extension iframe.
- [azure-devops-extension-api](https://github.com/Microsoft/azure-devops-extension-api): Contains REST client libraries for the various Azure DevOps feature areas.
- [azure-devops-ui](https://developer.microsoft.com/azure-devops): UI library containing the React components used in the Azure DevOps web UI.

# Project notes on `azure-devops-ui` usage pattern:

In terms of current repo above library will be installed from local/customized zipped tarball containing changes which are necessary to being adapted to the 18th version of React upstream library and prevent peer dependencies conflicts with the latest `gantt-task-react` version.
Zipped archive was added to reduce overall amount of `azure-devops-ui` library files.
For example, if you got exception like this:

```
TS2769: No overload matches this call. Overload 1 of 2, '(props: I*Props | Readonly<I*Props>): *', gave the following error.
Type '{ children: (Element | undefined)[]; className: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<*> & Readonly<I*Props>'.
```
You have to 
- unzip archive;
- provide required updates (for example - find I*Props file add field `children?: React.ReactNode;`);
- create fresh tarball from local unzipped folder with the latest updates - `tar zcvf azure-devops-ui.tar.gz azure-devops-ui`.

Some external dependencies:
- `React` - Is used to render the UI.
- `TypeScript` - It written in TypeScript and compiled to JavaScript
- `SASS` - Extension samples are styled using SASS (which is compiled to CSS and delivered in webpack js bundles).
- `webpack` - Is used to gather dependencies into a single javascript bundle for each sample.

## Building the project

Just run:
    `npm install`

### Launch project to debug against Azure DevOps    
1. `npm run start:dev`
2. `java LocalHTTPServer` (env X_COOKIE="", copy from browser for dev.azure.com)
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

## Icons
[Material design icon](https://github.com/google/material-design-icons) was used, which is redistributed under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html). The color of the icon for dark theme was modified.
