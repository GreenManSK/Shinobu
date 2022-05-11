// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const _environment = {
  firebase: {
    projectId: 'shinobu-7c893',
    appId: '1:826493978428:web:365398e02614528cee0039',
    storageBucket: 'shinobu-7c893.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyAviL8dFBP8s6kmgU4403MulODzSaMuMg4',
    authDomain: 'shinobu-7c893.firebaseapp.com',
    messagingSenderId: '826493978428',
  },
  production: false,
  corsServer: "http://127.0.0.1:8080/",
  anidbApi: {
    url: "http://api.anidb.net:9001",
    clientVersion: "0",
    clientName: 'name'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
