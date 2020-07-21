module.exports = {
  apps: [{
    name: "chrome extension backup",
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
