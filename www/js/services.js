'use strict';

angular.module('app-constants', [])
.constant('apiUrl', '@@apiUrl');

angular.module('app.services', ['ngResource','app-constants'])

//Login Service
.factory('LoginService', function($resource,apiUrl){
  var data = $resource('http://169.44.112.56:8084/psd2demoapp/user/profile' , {}, {
      authenticateUser:{
          method:'GET',
          headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': 'Basic amF5ZGVyb3lAaW4uaWJtLmNvbTpwYXNzd29yZDAx'
            }
          }
      });
      return data;
  })

  //OAuth Service
  .factory('OAuthService', function($resource,apiUrl){
    var data = $resource('http://169.44.112.56:8081/oauth2server/oauth/token' , {}, {
        general:{
            method:'POST',
            headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'authorization': 'Basic cG9zdG1hbjpwYXNzd29yZDAx'
              }
            }
        });
        return data;
    })

    //Bank Account details Service
    .factory('AccountDetails', function($resource,apiUrl){
      var data = $resource('http://169.44.112.56::8082/psd2api/banks/BARCGB/accounts/5437/owner/account' , {}, {
          accountDetailsById:{

              }
          });
          return data;
      })

//factory for sign up service
  .factory('SignUpService', function($resource){
    // var data = $resource('http://169.44.9.228:8080/mcabuddy/user/authenticate' , {}, {
    var data = $resource('http://169.44.112.56:8084/psd2demoapp/user' , {}, {
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

    //factory for create client for Oauth
    .factory('CreateClientForOAuth', function($resource){
        // var data = $resource('http://169.44.9.228:8080/mcabuddy/user/authenticate' , {}, {
        var data = $resource('http://169.44.112.56:8081/oauth2server/admin/client' , {}, {
            createClientForOAuth:{
                method:'POST',
                headers: {
                      'Content-Type': 'application/json'
                  }
                }
            });
            return data;
        })

    //factory for create client for Oauth
    .factory('CreateBankUser', function($resource){
        // var data = $resource('http://169.44.9.228:8080/mcabuddy/user/authenticate' , {}, {
        var data = $resource('http://169.44.112.56:8081/oauth2server/admin/user' , {}, {
            createBankUser:{
                method:'POST',
                headers: {
                      'Content-Type': 'application/json'
                  }
                }
            });
            return data;
    })

    //factory for sign up service
    .factory('InformationService', function($resource){
        var data = $resource('http://169.44.112.56:8084/psd2demoapp/info/:value' , {value:"@value"}, {
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
})



// factory for ngstorage
.factory ('StorageServiceForToken', function ($localStorage) {
    $localStorage = $localStorage.$default({
      tokenInformation: []
    });

    var _getAll = function () {
      return $localStorage.tokenInformation;
    };

    var _add = function (thing) {
      $localStorage.tokenInformation.push(thing);
    }

    var _remove = function (thing) {
      $localStorage.tokenInformation.splice($localStorage.tokenInformation.indexOf(thing), 1);
    }

    return {
        getAll: _getAll,
        add: _add,
        remove: _remove
      };
});
