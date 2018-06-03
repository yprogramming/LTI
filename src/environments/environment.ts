// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyADz--_8Gg1J3wORhbbvrWf5M1Wkg8iJn8',
    authDomain: 'laotour-info.firebaseapp.com',
    databaseURL: 'https://laotour-info.firebaseio.com',
    projectId: 'laotour-info',
    storageBucket: 'laotour-info.appspot.com',
    messagingSenderId: '753926615292'
  },
  ANONYMOUS_SECRET: 'laotourapi@nuol.fns.edu.la',
  SERVER_ADDRESS: 'http://localhost:3000'
};
