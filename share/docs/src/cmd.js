const { append, remove } = require('./readmes.js');

console.log('createing README.md');

const fileOut = '../../../README.md';
const filesIn = [
  { path: '../../../app1201/Makefile', mark: '\n```\n' },
  { path: '../../../app1201/docker-compose.dev.yml', mark: '\n```\n' },
  { path: '../../../app1201/frontend/Dockerfile.dev', mark: '\n```\n' },
  { path: '../../../app1201/api/Dockerfile.dev', mark: '\n```\n' },
  {
    path: '../../../app1201/frontend/package.json',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/package.json',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/frontend/src/app/app.module.ts',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/frontend/src/app/app-routing.module.ts',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/frontend/src/app/app.component.ts',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/frontend/src/app/app.component.html',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/server.js',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/config/environment.js',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/controllers/UserController.js',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/models/User.js',
    mark: '\n```\n',
  },
  {
    path: '../../../app1201/api/routes/UserRoute.js',
    mark: '\n```\n',
  },
];
const publish = (cmd) => {
  remove({ fileOut: cmd.fileOut });
  console.log('removed.');
  cmd.filesIn.forEach((file) => {
    console.log('each file.');
    append({ fileIn: file.path, fileOut, mark: file.mark });
  });
};

publish({ fileOut, filesIn });

console.log('created README.md');
