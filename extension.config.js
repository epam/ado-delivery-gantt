const environments = {
    development: {
        public: false,
        id: "ado-gantt-plugin-dev",
        name: "[Dev] Delivery Gantt",
        baseUri: "https://localhost:3000"
    },
    production: {
        public: false,
        id: "ado-gantt-plugin",
        name: "Delivery Gantt",
        scopes: [
            "vso.work",
            "vso.code"
        ]
    }
}

module.exports = () => {
    const {
      PUBLISHER_NAME = '',
      EXTENSION_NAME = '',
      EXTENSION_VERSION = '',
      NODE_ENV = 'development'
    } = process.env;

    const envConfig = environments[NODE_ENV];

    if (!envConfig) {
        throw { message: `Specified target plugin mode ${NODE_ENV} is not supported.`}
    }

    const config = {
      ...envConfig,
      name: EXTENSION_NAME || envConfig.name,
      version: EXTENSION_VERSION,
      publisher: PUBLISHER_NAME
    };

    return {
        ...config,
        manifestVersion: 1,
        description: "Effortlessly track team progress with a hierarchical Gantt chart displaying Epics, Features, and Stories issue types.",
        demands: [
          "api-version/3.0"
        ],
        categories: [
          "Azure Boards"
        ],
        targets: [
          {
            id: "Microsoft.VisualStudio.Services"
          }
        ],
        content: {
          details: {
            path: "README.md"
          }
        },
        icons: {
          default: "img/calendar.png"
        },
        files: [
          {
            path: "dist",
            addressable: true
          },
          {
            path: "img",
            addressable: true
          }
        ],
        contributions: [
          {
            id: "ado-planner-plugin",
            type: "ms.vss-web.hub",
            description: "ADO Planner plugin",
            targets: [
              "ms.vss-work-web.work-hub-group"
            ],
            properties: {
              name: config.name,
              icon: {
                dark: "img/calendar_dark.png",
                light: "img/calendar_light.png"
              },
              uri: "dist/hub.html"
            }
          }
        ]
      };
}
