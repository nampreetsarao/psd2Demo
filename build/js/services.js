'use strict';

angular.module('app-constants', [])
.constant('apiUrl', 'http://localhost:8084/psd2demoapp');

angular.module('app.services', ['ngResource','app-constants'])

//Login Service
.factory('LoginService', function($resource,apiUrl){
  // var data = $resource('http://169.44.9.228:8080/mcabuddy/user/authenticate' , {}, {
  //var data = $resource('http://localhost:8084/psd2demoapp/user/profile' , {}, {
  var data = $resource(apiUrl+'/user/profile', {}, {
      authenticateUser:{
          method:'GET',
          // method:'POST',
          headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': 'Basic amF5ZGVyb3lAaW4uaWJtLmNvbTpwYXNzd29yZDAx'
            }
          }
      });
      return data;
  })

//factory for sign up service
  .factory('SignUpService', function($resource){
    // var data = $resource('http://169.44.9.228:8080/mcabuddy/user/authenticate' , {}, {
    var data = $resource('http://localhost:8084/psd2demoapp/user' , {}, {
        signup:{
            method:'PUT',
            // method:'POST',
            headers: {
                  'Content-Type': 'application/json'
              }
            }
        });
        return data;
    })


    //factory for sign up service
    .factory('InformationService', function($resource){
        var data = $resource('http://localhost:8084/psd2demoapp/info/:value' , {value:"@value"}, {
            general:{
                method:'GET',
                headers: {
                      'authorization': 'Basic amF5ZGVyb3lAaW4uaWJtLmNvbTpwYXNzd29yZDAx'
                  }
                }
            });
            return data;
        })




// factory for ngstorage
.factory ('StorageService', function ($localStorage) {
    $localStorage = $localStorage.$default({
      profileInformation: []
    });

    var _getAll = function () {
      return $localStorage.profileInformation;
    };

    var _add = function (thing) {
      $localStorage.profileInformation.push(thing);
    }

    var _remove = function (thing) {
      $localStorage.profileInformation.splice($localStorage.profileInformation.indexOf(thing), 1);
    }

    return {
        getAll: _getAll,
        add: _add,
        remove: _remove
      };
});
