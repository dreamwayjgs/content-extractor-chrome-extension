module.exports = {
  apps: [{
    name: "chrome extension Prisma APIs",
    script: 'dist/index.js',
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
