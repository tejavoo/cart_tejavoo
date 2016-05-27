var app = angular.module('putApp', ['ngMaterial',"ngStorage"]);
    app.controller('putCtrl',['$scope','$http',function($scope,$http){
      $http.get("http://iitm.cloudapp.net/api/get_items_today/").then(function(response) {
        $scope.putData = response.data;
      });
      
    }]);

    app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange', {
     'default':'800' 
   })
   .accentPalette('teal', {
     'default':'500'
   });
});


console.log('%c PutPeace! loves Innovation ', 'background: #eee; color: #025284; font-size:x-large; font-weight:bolder');

 app.controller('HeaderCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

  })
  .controller('RightCtrl', function ($scope,$localStorage, $timeout, $mdSidenav, $log,$http) {
      $scope.state = 1;
      $scope.navRight = "Checkout";
  
      $scope.nextPage = function() {
        if ($scope.state == 1) {

           if (typeof($localStorage.security_key) != "undefined") {
           //   window.location = "mainApp.html?rel=aacf59ec0f";
            var fh = new FormHelper();
            fh.append("security_key", $localStorage.security_key);                       
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; 
            $http.post("http://iitm.cloudapp.net/api/get_user/" + $localStorage.pk + "/",fh.data).success(function(data, status, headers, config) {
                  //$scope.fullName = data[0].fields.name;
                  $scope.phonenumber = data[0].fields.phonenumber;
                  $scope.address = data[0].fields.address;
                  $scope.balance = data[0].fields.account_balance;
                  $scope.getDeliverydrop();
            }).error(function(data, status, headers, config) {
                  // document.getElementById('indNetErr').style.display = 'block';
                    });   

        } else {
          $scope.state = 2;
        }        
        } else  if ($scope.state == 3) {
          $scope.state = 4;
          $scope.navRight = "Pay Now";
      } else if ($scope.state == 4) {
            $scope.paymentCheck();
            //$scope.state = 5;
        }
       
      }

      $scope.prevPage = function() {
        if ($scope.state ==3) {
          $scope.state = 1;
          $scope.navRight = "Checkout";
        } else if ($scope.state ==4) {
          $scope.state = 3;
        }


      }

      $scope.deliveryDetails = function() {
        $scope.getDeliverydrop();
      }

      $scope.getDeliverydrop = function() {
        
                $http.get("http://127.0.0.1:8000/api/fooddrops/").success(function(data, status, headers, config) {
                  $scope.fooddrops = data;  
                  $scope.fullName = $localStorage.fullName;
                  $scope.state = 3;
                  $scope.navRight = "Pay 40 Rs";
                        
        }).error(function(data, status, headers, config) {
           //document.getElementById('netErr').style.display = 'block';
            });
      }

       $scope.setAmount = function(cost) {
          $scope.amount  = cost;
       }

        $scope.paymentCheck = function() {
          /*
            if ($scope.walletBalance + parseInt($scope.amount) < $scope.cost) 
              {
                $scope.paymentErr = true;
                return ;
              } else {
                $scope.paymentErr  = false;
              } */
            var options = {
                          "key": "rzp_live_DuqTPeHhLzevu2",
                          "amount": $scope.amount*100,
                          "name": "PutPeace.com",
                          "description": "Money to your printer Wallet",
                          "image": "print/img/symbol.png",
                          "handler": function (response){
                            var fh = new FormHelper();
                            fh.append("security_key", $localStorage.security_key);           
                            fh.append("debit_amount", $scope.amount);           
                            fh.append("type", "Credit");           
                            var captureURL = "http://putpeace.com/api/make_payment/" + $localStorage.pk + "/" + response.razorpay_payment_id + "/"
                            $scope.caputurePay(captureURL,fh);
                          },
                          "prefill": {
                              "name": $localStorage.fullName,
                              "email": $localStorage.email
                          },
                          "notes": {
                              "address": "Hello World"
                          },
                           "theme": {
                              "color": "#FF5722 "
                          }                       
                      };
              var rzp1 = new Razorpay(options);          
              rzp1.open();
        }


         $scope.caputurePay = function(captureURL,fh) {

              $http.post(captureURL, fh.data).success(function(data, status, headers, config) {  
                if (data == 'Unable to capture try again.') {
                  $scope.caputurePay();
                } else if (data == 'Bad request!') {
                  alert("There is an issue with your payment method, Please contact Madhu(+91 7418991535) for help");
                }
                if (data[0].fields.amount== $scope.amount) {
                  //$('#amountVal').val("") ;
                  //animateValue('balAfter', angular.element(document.querySelector('[ng-controller="doPaymentCtrl"]')).scope().walletBalance, data[0].fields.balance_after, 500);                  
                  //$scope.walletBalance = data[0].fields.balance_after; 
                  $scope.state = 5;                             
                } ;
              }).error(function(data, status, headers, config) {
           //document.getElementById('indNetErr').style.display = 'block';
            }); 
        }        

    
  }).controller('registerCtrl', function($scope, $localStorage,$http, $location,afterLogin) {
   $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      $scope.fullName = "";
      $scope.email = "";
      $scope.password = "";
      $scope.emailExists = false; //Email already exists in database

      $scope.register = function() {
          $scope.registerSubmit = true;
          if ($scope.registerForm.$invalid) return;


          var fh = new FormHelper();
          fh.append("email", $scope.email);
          fh.append("password", $scope.password);
          fh.append("name", $scope.fullName);
          $http.post("http://iitm.cloudapp.net/api/register/", fh.data).success(function(data, status, headers, config) {
      if (typeof(data[0]) == "string" )  {


            $scope.emailExists = true;
            $scope.registerMsg = data[0];
          } else if (data[0].fields) {
             afterLogin.doRedirect(data,$localStorage);
          }
            }).error(function(data, status, headers, config) {
             
          $scope.networkError = true;
            
            });
          ;
        }



          $scope.registerOnEnter = function($event) {
            if ($event.keyCode == 13) {
              $scope.register();
              }
          }

        }).controller('loginCtrl',function($scope, $localStorage, $http,$location, afterLogin) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $scope.email = "";
        $scope.password = "";
        $scope.invalidCredentials = false;

       

        $scope.login = function() {
           $scope.loginSubmit = true
           if ($scope.loginForm.$invalid) return;

          var fh = new FormHelper();
          fh.append("email", $scope.email);
          fh.append("password", $scope.password);
          $http.defaults.useXDomain = true;
          $http.post("http://iitm.cloudapp.net/api/login/", fh.data).success(function(data, status, headers, config) {
            $scope.networkError = false;
            if (typeof(data[0]) == "string" ) {

                $scope.invalidCredentials = true;
                $scope.inValidMessage = data[0];
                //alert("fail log");
            } else if (typeof(data[0]) == "object" ) {
                  afterLogin.doRedirect(data,$localStorage);
                } 
            }).  error(function(data, status, headers, config) {
            
              $scope.networkError = true;
            
            });;
          }

          $scope.loginOnEnter = function($event) {
            if ($event.keyCode == 13) {
              $scope.login();
              }
          }
});
  
  
function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}


app.factory("afterLogin", function() {
  return {
    doRedirect: function(data, $localStorage) {
                    $localStorage.security_key = data[0].fields.security_key ;
                    $localStorage.pk = data[0].pk ;
                    $localStorage.fullName = data[0].fields.name ;
                    $localStorage.helpScore = data[0].fields.Help_score
                    $localStorage.last_droppoint = data[0].fields.last_droppoint;
                    $localStorage.email = data[0].fields.email;
                    $localStorage.$save();
                    angular.element(document.querySelector('[ng-controller="RightCtrl"]')).scope().balance = data[0].fields.account_balance;
                    angular.element(document.querySelector('[ng-controller="RightCtrl"]')).scope().phonenumber = data[0].fields.phonenumber;
                    angular.element(document.querySelector('[ng-controller="RightCtrl"]')).scope().address = data[0].fields.address;
                    angular.element(document.querySelector('[ng-controller="RightCtrl"]')).scope().fooddrop = data[0].fields.fooddrop;
                    angular.element(document.querySelector('[ng-controller="RightCtrl"]')).scope().getDeliverydrop();
 

    }
  };
});

function FormHelper() {
 this.data = "";
 
 this.append = function(name, val) {
   if (this.data.length > 0) {
     this.data += "&";
   }
   this.data += encodeURIComponent(name);
   this.data += "=";
   this.data += encodeURIComponent(val);
 }
}
