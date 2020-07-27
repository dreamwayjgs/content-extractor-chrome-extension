module.exports = {
  apps: [{
    name: "chrome extension backup",
    script: 'dist/run.js',
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
