angular.module('app.controllers', [])

.controller('LoadingCtrl', function($scope, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
})

.controller('showAllAccountCtrl', function($scope,StorageServiceForToken,$state,$http,AccountDetails,$resource,$ionicPopup,$ionicLoading) {
  $scope.allAccountDetails=[];
  $scope.oauthData = StorageServiceForToken.getAll();
  if($scope.oauthData!=null){
      $scope.authorizationToken = 'Bearer '+ $scope.oauthData[0].access_token;
      //$resource.authorizationToken = $scope.authorizationToken ;
  }else{
    $scope.allAccountDetails='First authenticate and then make this call.';
  }
  $http.defaults.headers.common.Authorization=$scope.authorizationToken;
  $http.get('http://169.44.112.56:8082/psd2api/my/banks/BARCGB/accounts').then(function(resp){
  		console.log('Success', resp); // JSON object
      $scope.allAccountDetails=resp;
  	}, function(err){
  		console.error('ERR', err);
      var alertPopup = $ionicPopup.alert({
        title: 'Show all accounts: Alert',
        template:'Error occured while calling the API:'+err
      });
  	});



  })


.controller('aboutPSD2Ctrl', function($scope,StorageServiceForToken,$http,AccountDetails,$resource,$ionicPopup) {
  $scope.accountDetails=[];

  $scope.oauthData = StorageServiceForToken.getAll();
  if($scope.oauthData!=null){
      $scope.authorizationToken = 'Bearer '+ $scope.oauthData[0].access_token;
      //$resource.authorizationToken = $scope.authorizationToken ;
  }else{
    $scope.accountDetails='First authenticate and then make this call.';
  }
  $http.defaults.headers.common.Authorization=$scope.authorizationToken;
  $http.get('http://169.44.112.56:8082/psd2api/banks/BARCGB/accounts/5437/owner/account').then(function(resp){
  		console.log('Success', resp); // JSON object
      $scope.accountDetails=resp;
  	}, function(err){
  		console.error('ERR', err);
      var alertPopup = $ionicPopup.alert({
        title: 'Alert',
        template:'Did you authorize the app to access bank information? Error occured while calling the API:'+err.data.error+ ".More: "+err.statusText
      });
  	})

  })

//OAuth implementation
.controller('exploreAPICtrl', function($scope, OAuthService,$http, $state,$interval, $cordovaInAppBrowser,StorageServiceForToken) {
    $scope.apiClick =  function(){
    var ref = cordova.InAppBrowser.open('http://169.44.112.56:8081/oauth2server/oauth/authorize?client_id=postman&redirect_uri=http://localhost/callback&scope=write&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes,toolbar=yes');
    ref.addEventListener('loadstart', function(event) {
    if ((event.url).startsWith("http://localhost/callback")) {
          $scope.requestToken = (event.url).split("code=")[1];
          $scope.oAuth=[];
         //Fetch general Information details from the API
         OAuthService.general(
           {
             grant_type: 'authorization_code',
             redirect_uri: 'http://localhost/callback',
             state: '4281938',
            code:  $scope.requestToken},
            {

            },
            function(message) {
               $scope.oauthData=message;
               ref.close();
               //Persisting the token data in local storage
               StorageServiceForToken.remove($scope.oauthData);
               StorageServiceForToken.add($scope.oauthData) ;
               $state.go('menu.showAllAccounts');
            });
       };
     });

    if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
    }
   };
 })


  .controller('aboutPSD22Ctrl', function($scope, InformationService,$state,$ionicPopup) {
    $scope.general=[];
    //Fetch general Information details from the API
    InformationService.general({value : 'general' }, {},
    function(message) {
      $scope.general=message;
      // function to retrive the response
      if($scope.general.status=='SUCCESS'){
        $scope.general=message;
      }
    });

    //Fetch  IBM information details from the API
    InformationService.general({value : 'ibm' }, {},
    function(message) {
      $scope.ibmInformation=message;
    });

    //Fetch  bookmarks from the API
    InformationService.general({value : 'bookmarks' }, {},
    function(message) {
      $scope.bookmarks=message.response.additionalInfo;
    });



  })

  .controller('profileCtrl', function($scope,StorageService) {
    $scope.userProfile = StorageService.getAll();
  })


  .controller('transactionDetailsCtrl', function($scope,StorageService,$http,StorageServiceForToken,$ionicLoading) {
    



      $ionicLoading.show(); 
      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };
      
      $scope.oauthData = StorageServiceForToken.getAll();
      if($scope.oauthData!=null && $scope.oauthData.length>0){
             $scope.authorizationToken = 'Bearer '+ $scope.oauthData[0].access_token;
       }else{
            $scope.transactionDetails='First authenticate and then make this call.';
       }

    $http.defaults.headers.common.Authorization=$scope.authorizationToken;
    //$http.defaults.headers.common.Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjY5MjIyOTUsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiYWViM2UxNTEtNjlhNi00MGVjLTgwMjAtOGFhNTFmYmNkMDRmIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.NXuuNGyo4GnX4aqW8PZoXDfmE_MmoGFXxbDK5ggrTxc';
    var interBankCount=0;
    var internationBankCount=0;
    var withInBankCount=0;        
     $http.get('http://169.44.112.56:8082/psd2api/banks/BARCGB/accounts/5437/owner/transaction-requests').then(function(resp){
          $ionicLoading.hide();
          console.log('Success', resp);
          $scope.transactionDetails = resp.data;
          $scope.groups = [];
          for (var i=0; i<$scope.transactionDetails.length; i++) {
              
              var highlightChallenge="";
              if($scope.transactionDetails[i].challenge !== undefined){
                  highlightChallenge="*";
              }

              $scope.groups[i] = {
                name:$scope.transactionDetails[i].body.value.amount + " "+$scope.transactionDetails[i].body.value.currency +" " +highlightChallenge,
                items: []
              };
            
               $scope.groups[i].items.push("To Account: "+$scope.transactionDetails[i].body.to.account_id); 
               $scope.groups[i].items.push("Payment Status: "+$scope.transactionDetails[i].status);
               $scope.groups[i].items.push("Transaction Id: "+$scope.transactionDetails[i].transaction_ids);
               
               if($scope.transactionDetails[i].challenge !== undefined){
                  $scope.groups[i].items.push("Transaction has been challenged ");
                  $scope.groups[i].items.push("Challenge Type: "+$scope.transactionDetails[i].challenge.challenge_type);
               }

               if($scope.transactionDetails[i].type=='WITHIN_BANK'){
                
                withInBankCount++;

               }
                if($scope.transactionDetails[i].type=='INTER_BANK'){
                interBankCount++;

               }

               if ($scope.transactionDetails[i].type=='INTERNATIONAL'){
                internationBankCount++;
               }
               
            }  

            $scope.options = {  
                    chart: {
                      type: 'pieChart',
                      height: 500,
                      x: function(d){return d.key;},
                      y: function(d){return d.y;},
                      showLabels: true,
                      duration: 500,
                      labelThreshold: 0.01,
                      labelSunbeamLayout: true,
                      legend: {
                        margin: {
                          top: 5,
                          right: 35,
                          bottom: 5,
                          left: 0
                        }
                      }
                    }
                  };
                  $scope.data = [  
                    {
                      key: "International Transfers",
                      y: internationBankCount
                    },
                    {
                      key: "Within-Bank Transfers",
                      y: withInBankCount
                    },
                    {
                      key: "Inter-Bank Transfers",
                      y: interBankCount
                    }
                  ];



        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
      });







      

  })


  .controller('makeAPaymentCtrl', function($scope,$http, $ionicLoading, StorageServiceForToken) {
     $scope.makePaymentObj = {
          "type": "",
          "from": {
              "bank_id": "",
              "account_id": ""
          },
          "to":{
              "bank_id":"",
              "account_id":""
            },  
          "value":{
              "currency":"",
              "amount":""
            },
          "description":""
      }


      $scope.transactionTypes = [];
      
       $scope.oauthData = StorageServiceForToken.getAll();
        if($scope.oauthData!=null && $scope.oauthData.length>0){
            $scope.authorizationToken = 'Bearer '+ $scope.oauthData[0].access_token;
        }else{
          $scope.accountDetails='First authenticate and then make this call.';
        }
        //$http.defaults.headers.common.Authorization="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjY3NjQzMDIsInVzZXJfbmFtZSI6Im5zaW5naCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiZmI4Y2RhMGYtZGYyOS00Mzk3LTk4Y2ItN2YxNTM0MTlhMWNiIiwiY2xpZW50X2lkIjoicG9zdG1hbiIsInNjb3BlIjpbIndyaXRlIl19.hAyB255VoPzb-87LcRkW999rf7iQJ7JIBdU_NovmwHA";
        $http.defaults.headers.common.Authorization=$scope.authorizationToken;
        $ionicLoading.show();
      $http.get('http://169.44.112.56:8082/psd2api/banks/BARCGB/accounts/5437/owner/transaction-request-types').then(function(resp){
          $ionicLoading.hide();
          console.log('Success', resp);
          $scope.transactionTypes = resp.data;
        }, function(err){
          console.error('ERR', err);
          $ionicLoading.hide();
        });

      $scope.paymentSubmit = function(){
        console.log($scope.makePaymentObj);
        $scope.oauthData = StorageServiceForToken.getAll();
        if($scope.oauthData!=null && $scope.oauthData.length>0){
            $scope.authorizationToken = 'Bearer '+ $scope.oauthData[0].access_token;
        }else{
          $scope.accountDetails='First authenticate and then make this call.';
        }

        $http.defaults.headers.common.Authorization=$scope.authorizationToken;  
        //$http.defaults.headers.common.Authorization="Bearer d8494a26-df21-4c3e-ace3-ff701bf8c4b4";
         $http.post("http://169.44.112.56:8082/psd2api/banks/BARCGB/accounts/5437/owner/transaction-request-types/INTER_BANK/transaction-requests", $scope.makePaymentObj, {
            
        }).success(function(responseData) {
            //do stuff with response
            $ionicLoading.hide();
            console.log('Success', responseData);
            alert("Successful Transaction");
        });

      };

  })


  .controller('loginCtrl', function($scope, $http, $resource,LoginService, $state,$ionicPopup,StorageService, $localStorage,$ionicLoading ) {
        
 
    if(StorageService.getAll().data !== undefined){
           $state.go('menu.aboutPSD22');
    }

    
    $scope.click =  function(){
      $ionicLoading.show({templateUrl:"templates/loading.html"});
      //clearing the userProfile at the time of user login
      $scope.dataFromService=[];
      $scope.authTokenForLogin= btoa(this.userId+":"+this.password);

      $http.defaults.headers.common.Authorization="Basic "+$scope.authTokenForLogin;
      $http.get('http://169.44.112.56:8084/psd2demoapp/user/profile').then(function(resp){
          $ionicLoading.hide();
          console.log('Success', resp);
          $scope.dataFromService=resp;
          // StorageService.remove($scope.dataFromService)
          StorageService.add($scope.dataFromService) ;
          $state.go('menu.aboutPSD22');
           // JSON object
          // $scope.allAccountDetails=resp;
        }, function(err){
          console.error('ERR', err);
          $scope.dataFromService=err;
          $ionicLoading.hide();
        });
      // LoginService.authenticateUser({email: this.userId, pwd: this.password}, {},
      //   function(message) {
      //     $scope.dataFromService=message;
      //     // function to retrive the response
      //     if($scope.dataFromService.status=='SUCCESS'){
      //       StorageService.remove($scope.dataFromService);
      //       //Persisting the user data in local storage
      //       StorageService.add($scope.dataFromService) ;
      //       $scope.loginSuccessful="Login was successful";
      //       $state.go('menu.aboutPSD22');
      //     }
      //   });
      }
    })

    .controller('signupCtrl', function($scope, CreateBankUser, SignUpService,$state,$ionicPopup, CreateClientForOAuth, $ionicLoading ) {
      $scope.signUpUser =  function(){
      $ionicLoading.show({templateUrl:"templates/loading.html"});
        //clearing the userProfile at the time of user login
      $scope.signupResponse=[];
      //Create client for OAuth
      CreateBankUser.createBankUser(
        {  },
        {
        username: this.firstName.charAt(0)+this.lastName,
        password: this.password,
        role:'USER'
      },
      function(message) {
        $scope.createBankUser=message;
        $ionicLoading.hide();
        // function to retrive the response
        if($scope.createBankUser.status=='SUCCESS'){
        }
      },function(message) {
        $ionicLoading.hide();
        $scope.createBankUser=message;
      }

    );

    //calling sign up service api
    SignUpService.signup(
      {  }, {email: this.userId,
        password: this.password,
        role: 'USER',
        firstName:  this.firstName,
        lastName: this.lastName,
        phone: this.phoneNumber

      },
      function(message) {
        $scope.signupResponse=message;
        // function to retrive the response
        if($scope.signupResponse.status=='SUCCESS'){
          var alertPopup = $ionicPopup.alert({
            title: 'Signup',
            template:'User added successfully. Please login now.'
          });
          $state.go('login');
        }
      },function(message) {
        $scope.signupResponse=message;
      }
    );

  }
})
