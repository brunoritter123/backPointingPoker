var Service = require('node-windows').Service;
const path = require('path');
 
// Create a new service object
var svc = new Service({
  name:'ScrumPoker',
  description: 'ScrumPoker',
  script: path.join(__dirname)+'\\loader.js',
  nodeOptions: [
    '--http-parser=legacy'
  ]
});
 
// Listen for the 'install' event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
// install the service
svc.install();