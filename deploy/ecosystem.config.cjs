// PM2 process definition for cpacontractingllc.com
// Start/reload:  pm2 startOrReload deploy/ecosystem.config.cjs --update-env
const path = require("path");

module.exports = {
  apps: [
    {
      name: "cpa-contracting",
      cwd: path.resolve(__dirname, ".."),
      script: "node_modules/next/dist/bin/next",
      // Bind to localhost only: the public reaches the site through Nginx.
      args: "start -H 127.0.0.1 -p 3001",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "400M",
      time: true,
      env: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
        // ENQUIRY_ENDPOINT: "https://...",  // set later, when the backend server is deployed
      },
    },
  ],
};
