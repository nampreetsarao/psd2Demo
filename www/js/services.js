'use strict';

angular.module('app-constants', [])
.constant('apiUrl', '@@apiUrl')


.constant("server", "169.44.112.56")
.constant("port", "8082")
.constant("baseURL","/psd2api/")
.constant("accNo","8899")

.factory('constantService', function ($http, server, port, baseURL, accNo) {
    return {
        server:server,
        port: port,
        baseURL: baseURL,
        accNo : accNo
    }
});

angular.module('app.services', ['ngResource','app-constants'])


//Acounts service 
.service('accountsService', function($state,$http,$q,$ionicLoading,constantService,StorageServiceForToken,$ionicPopup) {
      //to fetch all acounts
      var deferred = $q.defer();
    this.getAccounts = function() {
      $ionicLoading.show(); 
      var allAccountDetails=[];
      var authorizationToken = '';
      var oauthData = StorageServiceForToken.getAll();
      if(oauthData!=null && oauthData.length>0){
          authorizationToken = 'Bearer '+ oauthData[0].access_token;
      }else{
        allAccountDetails='First authenticate and then make this call.';
      }
      $http.defaults.headers.common.Authorization=authorizationToken;
      //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Njc4OTUzODQsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiMTExMWRhNzMtMWY3ZC00NDA1LTk3ZDEtM2FjNGNiNmM5MzllIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.XtM6MjWkbVlaudZRWXHvTlhpzTU9Q64qF7UdR-BB5Zs';
      //alert('http://'+constantService.server+':'+constantService.port+'/psd2api/my/banks/BARCGB/accounts');
      $http.get('http://'+constantService.server+':'+constantService.port+'/psd2api/my/banks/BARCGB/accounts').then(function(resp){
          console.log('Success', resp); // JSON object
          //allAccountDetails=resp;
          deferred.resolve(resp);
          $ionicLoading.hide(); 
        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Show all accounts: Alert',
            template:'Error occured while calling the API:'+err
          });
        });
        return deferred.promise;
    };
})

//About Service
.service('aboutService', function($state,$http, $q,$ionicLoading,constantService,StorageServiceForToken,$ionicPopup) {
      
    this.getAccountDetails = function() {
      $ionicLoading.show(); 
      var accountDetails=[];
      var authorizationToken = '';
      var deferred = $q.defer();
      var oauthData = StorageServiceForToken.getAll();
      if(oauthData!=null && oauthData.length>0){
          authorizationToken = 'Bearer '+ oauthData[0].access_token;
      }else{
        accountDetails='First authenticate and then make this call.';
      }
      $http.defaults.headers.common.Authorization=authorizationToken;
      //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjcwNDE1NTksInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiM2MyNTk3OWYtMmVkNS00YTdjLTgzNjYtNTYyMzI2NzQ0ZGQ4IiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.sv9YjcD1bbjR42enR-B9QQ040x5oO0Y7TKpQyIJu88o';
      $http.get('http://'+constantService.server+':'+constantService.port+'/psd2api/banks/BARCGB/accounts/'+localStorage.getItem("accountID")+'/owner/account').then(function(resp){
          console.log('Success', resp); // JSON object
          accountDetails=resp;
          deferred.resolve(resp);
          $ionicLoading.hide(); 
        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template:'Error occured while calling the API: '+err.data.error+ ".More: "+err.statusText
          });
        });
        return deferred.promise;
    };
})

//Subscribe Service
.service('subscribeService', function($state,$http,$q, $rootScope, $ionicLoading,constantService,StorageServiceForToken,$ionicPopup) {
      
    this.getSubscriptionInfo = function(){
      $ionicLoading.show();
      //var subscriptionDetails = {}; 
      var authorizationToken = '';
      var oauthData = StorageServiceForToken.getAll();
      if(oauthData!=null && oauthData.length>0){
          authorizationToken = 'Bearer '+ oauthData[0].access_token;
      }else{
        //accountDetails='First authenticate and then make this call.';
        alert('First authenticate and then make this call.');
      }
      var deferred = $q.defer();
      $http.defaults.headers.common.Authorization=authorizationToken;
      //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Njc5NzQ3NzcsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiYTM5YTgwNTItOTA0My00OTk0LTkyNmYtMzI4OTBkM2JmNjcyIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.tUVYddvDGYZviKDWAx7OfkmjXKZf73NVbSz5UjrgyyY';
      $http.get('http://'+constantService.server+':'+constantService.port+'/psd2api/subscription').then(function(resp){
          console.log('Success', resp); // JSON object
          //subscriptionDetails=resp;
          $ionicLoading.hide();
          $rootScope.$broadcast('enableMenus');
          deferred.resolve(resp);  
        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template:'Error in getting subscrioption information:'+err.data.error+ ".More: "+err.statusText
          });
        }) 
      return deferred.promise;
    };

    this.subscribe = function(subscribeObj) {
      $ionicLoading.show(); 
      var authorizationToken = '';
      var oauthData = StorageServiceForToken.getAll();
      if(oauthData!=null && oauthData.length>0){
          authorizationToken = 'Bearer '+ oauthData[0].access_token;
      }else{
        //accountDetails='First authenticate and then make this call.';
        alert('First authenticate and then make this call.');
      }
      $http.defaults.headers.common.Authorization=authorizationToken;
      //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0Njc4Nzc4NzUsInVzZXJfbmFtZSI6InJwYWRhbGUiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjAwMTU0OGI5LTJiZGItNGNjOC05ZGM1LTFhMjYzMmIzZTE1NSIsImNsaWVudF9pZCI6InBvc3RtYW4iLCJzY29wZSI6WyJ3cml0ZSJdfQ.TFXuTjOd1w719HJ5VvNgBehuWU1XLX-7sYBEZxOn_aE';
      $http.post("http://"+constantService.server+':'+constantService.port+"/psd2api/subscription/request", subscribeObj, {
              
          }).success(function(responseData) {
              //do stuff with response
              $ionicLoading.hide();
              console.log('Success', responseData);
              
              var accountID = responseData.subscriptionInfo.accountId;
              localStorage.setItem("accountID", accountID);
              
              $rootScope.$broadcast('enableMenus');
              $ionicLoading.hide();      
              $state.go('menu.aboutPSD22');   
                   
          }).error(function(data, status) {
            console.error('Repos error', status, data);
            //$scope.dataFromService=data;
            $ionicLoading.hide();
          });
    };
})

//About Transaction
.service('transactionService', function($state,$http, $q,$ionicLoading,constantService,StorageServiceForToken,$ionicPopup) {
      
    var authorizationToken = '';
    var oauthData = StorageServiceForToken.getAll();
    if(oauthData!=null && oauthData.length>0){
        authorizationToken = 'Bearer '+ oauthData[0].access_token;
    } 

    $http.defaults.headers.common.Authorization=authorizationToken;
     //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjgyMTc0NDIsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiOWU1YWFiM2EtMGRiZi00MmQwLWFmYWItOGZlMTZjYjY0NTNjIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.YZIy5un3FCoMZNVXhg9ZXDyhfkkayIXoSZLvFLhuYO4';
    var deferredObjOfTranTypes = $q.defer();
    this.getTransactionTypes = function(){
      var transactionTypes = [];
      $ionicLoading.show(); 
      
      $http.get('http://'+constantService.server+':'+constantService.port+'/psd2api/banks/BARCGB/accounts/'+localStorage.getItem("accountID")+'/owner/transaction-request-types').then(function(resp){
          $ionicLoading.hide();
          console.log('Success', resp);
           deferredObjOfTranTypes.resolve(resp);
        }, function(err){
          $ionicLoading.hide();
          console.error('ERR', err);
        });
      return deferredObjOfTranTypes.promise;
    };


    var deferredObjOfTransactions = $q.defer();
    this.getTransactionDetails = function() {
      $ionicLoading.show(); 
      var transactionDetails=[];
      var accountDetails='First authenticate and then make this call.';
      
      $http.defaults.headers.common.Authorization=authorizationToken;
      //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjgyMTc0NDIsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiOWU1YWFiM2EtMGRiZi00MmQwLWFmYWItOGZlMTZjYjY0NTNjIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.YZIy5un3FCoMZNVXhg9ZXDyhfkkayIXoSZLvFLhuYO4';
      $http.get('http://'+constantService.server+':'+constantService.port+'/psd2api/banks/BARCGB/accounts/'+localStorage.getItem("accountID")+'/owner/transaction-requests').then(function(resp){
          console.log('Success', resp); // JSON object
          //transactionDetails=resp;
          deferredObjOfTransactions.resolve(resp);
          $ionicLoading.hide(); 
        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template:'Error occured while calling the API:'+err.data.error+ ".More: "+err.statusText
          });
        });
        return deferredObjOfTransactions.promise;
    };


    this.answerChallenge = function(challengeType, transactionId, challengeObject){
        $ionicLoading.show(); 
        $http.defaults.headers.common.Authorization=authorizationToken;
        $http.post('http://'+constantService.server+':'+constantService.port+'/psd2api/banks/BARCGB/accounts/'+localStorage.getItem("accountID")+'/owner/transaction-request-types/'+challengeType+'/transaction-requests/'+transactionId+'/challenge',challengeObject).then(function(resp){
          console.log('Challenge Accepted successfully', resp); // JSON object  

          $ionicLoading.hide();        
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template:'Challenge accepted successfully:'
          });
        }, function(err){
          $ionicLoading.hide();
          console.error('ERR', err);
          var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template:'Error occured while calling the API:'+err.data.error+ ".More: "+err.statusText
          });
        });
    };

    this.createTransactionRequest = function(transactionType, makePaymentObj){
      $ionicLoading.show(); 
      $http.post("http://"+constantService.server+':'+constantService.port+"/psd2api/banks/BARCGB/accounts/"+localStorage.getItem("accountID")+"/owner/transaction-request-types/"+transactionType+"/transaction-requests", makePaymentObj, {
        }).success(function(responseData) {
            //do stuff with response
            $ionicLoading.hide();
            console.log('Success', responseData);
            var alertPopup = $ionicPopup.alert({
            title: 'Make a Payment',
            template:'Transaction successfully submitted.'
          });
        });
    };

})

//Login Service : remove this authorization 
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
    };

    var _remove = function (thing) {
      $localStorage.profileInformation.splice($localStorage.profileInformation.indexOf(thing), 1);
    };

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
    };

    var _remove = function (thing) {
      $localStorage.tokenInformation.splice($localStorage.tokenInformation.indexOf(thing), 1);
    };

    return {
        getAll: _getAll,
        add: _add,
        remove: _remove
      };
});