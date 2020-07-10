module.exports = {
  apps: [{
    name: "app",
    script: 'dist/app.js',
    watch: true,
    ignore_watch: [
      "node_modules",
      "*.log",
      "src",
      "static",
      "*.map"
    ]
  }]
};
