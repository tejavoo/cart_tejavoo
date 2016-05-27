 //Loading animation
 document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}

var app = angular.module('main', ["ngStorage", "ngRoute",'ngMaterial','md.data.table']);

function adminZoomSet() {
  
  //document.body.style.fontSize = "16px";
}

app.config(['$routeProvider','$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider.
                when('/orderHistory', {
                    templateUrl: 'layout/admin/orderHistory.html',
                    controller: 'zoomSetup'
                }).           
                when('/makePayment', {
                    templateUrl: 'layout/admin/makePayment.html',
                    controller: 'zoomSetup'
                }).        
                when('/profile', {
                    templateUrl: 'layout/admin/profile.html',
                    controller: 'zoomSetup'
                }).   
                when('/doPayment', {
                    templateUrl: 'layout/admin/doPayment.html',
                    controller: 'zoomSetup'
                }).          
                when('/404', {
                     templateUrl: 'layout/static/404.html',
                    controller: 'zoomSetup'
                }).                                                                      
                otherwise({
                    redirectTo: '/404'
                });

                //$locationProvider.html5Mode(true);
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

app.controller('zoomSetup', function($scope,  $localStorage, $http) {
  adminZoomSet();
});

app.controller('preLoginZoomSetup', function($scope,  $localStorage, $http) {
    preLoginZoomSet();
});

app.controller('indexCtrl', function($scope,  $localStorage, $http) {
    preLoginZoomSet();
});


/* start Profile */
app.controller('ProfileCtrl', function($scope,  $localStorage, $http) {
    loginCheck($localStorage);
    $scope.readMode = true;
    var uid = $localStorage.pk;
    var fh = new FormHelper();
    fh.append("security_key", $localStorage.security_key);          
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    
    $http.post("http://iitm.cloudapp.net/api/get_user/" + uid + "/",fh.data).success(function(data, status, headers, config) {
          $scope.name = data[0].fields.name;
          $scope.phoneNumber = data[0].fields.phonenumber;
          $scope.address = data[0].fields.address;
          $scope.email = data[0].fields.email;
          $scope.helpScore = data[0].fields.Help_score;
    }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            });   


    $scope.updateEditUser  = function() {
         // document.getElementById('saveText').style.display = 'none';
        //document.getElementById('saveSpinner').style.display = 'block';



    var fh = new FormHelper();
    fh.append("security_key", $localStorage.security_key);          
    fh.append("name", $scope.name);                  
    fh.append("phonenumber",$scope.phoneNumber);          
    fh.append("address",$scope.address);          
    fh.append("college_id",1);  
    fh.append("password",$scope.password);        
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    
    $http.post("http://iitm.cloudapp.net/api/user_update/" + uid + "/",fh.data).success(function(data, status, headers, config) {
          //document.getElementById('saveText').style.display = 'block';
          //document.getElementById('saveSpinner').style.display = 'none';          

          $scope.readMode = true;
          $scope.name = data[0].fields.name;
          $scope.phoneNumber = data[0].fields.phonenumber;
          $scope.address = data[0].fields.address;
          $scope.email = data[0].fields.email;
    }).error(function(data, status, headers, config) {
          document.getElementById('saveText').style.display = 'block';
          document.getElementById('saveSpinner').style.display = 'none';          
          $scope.networkError = true;
            
            });;  
    }


});
/* end Profile */

/* start order History*/
app.controller('orderHistory', function($scope,  $localStorage, $http) {
         loginCheck($localStorage);
         $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
          var fh = new FormHelper();
          fh.append("security_key", $localStorage.security_key);          
          $http.post("http://iitm.cloudapp.net/api/get_orders/" + $localStorage.pk + "/", fh.data).success(function(data, status, headers, config) {
              $scope.orderHistory = data;
            }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            }); 
          $scope.dateFormat = function(date) {
              var arr = date.split(/[- :T]/), 
              date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], 00);
              var month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"][date.getMonth()];
              date = date.getDate   () + "-" + month ;
              return date;
          }
});

/* end order History */

/* start Make Payment */
app.controller('PaymentCtrl', function($scope, $localStorage, $http) {
        loginCheck($localStorage);        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
          var fh = new FormHelper();
          fh.append("security_key", $localStorage.security_key);
          $http.post("http://iitm.cloudapp.net/api/get_payments/" + $localStorage.pk + "/", fh.data).success(function(data, status, headers, config) {
              $scope.paymentHistory = data;
            }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            }); 
          $scope.dateFormat = function(date) {
              var arr = date.split(/[- :T]/), 
              date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], 00);
              var month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"][date.getMonth()];
              date = date.getDate    () + "-" + month ;
              return date;
          }

        var uid = $localStorage.pk;
        var fh = new FormHelper();
        fh.append("security_key", $localStorage.security_key);                       
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    
        $http.post("http://iitm.cloudapp.net/api/get_user/" + uid + "/",fh.data).success(function(data, status, headers, config) {
          $scope.walletBalance = data[0].fields.account_balance;
        }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            }); 

})
/* end Make Payment */

/* start Do Payment */
app.controller('doPaymentCtrl', function($scope, $localStorage,$http) {
  loginCheck($localStorage);
  var uid = $localStorage.pk;
  var fh = new FormHelper();
  fh.append("security_key", $localStorage.security_key);                       
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    

  $http.post("http://iitm.cloudapp.net/api/get_user/" + uid + "/",fh.data).success(function(data, status, headers, config) {
        $scope.walletBalance = data[0].fields.account_balance;


  }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            }); 


   $scope.setAmount = function(cost) {
            $scope.amount  = cost;
   }

           $scope.paymentCheck = function() {
            var options = {
                          "key": "rzp_live_DuqTPeHhLzevu2",
                          "amount": $scope.amount*100,
                          "name": "PutPeace.com",
                          "description": "Money to your printer Wallet",
                          "image": "img/symbol.png",
                          "handler": function (response){
                            var fh = new FormHelper();
                            fh.append("security_key", $localStorage.security_key);           
                            fh.append("debit_amount", $scope.amount);           
                            fh.append("type", "Credit");           
                            var captureURL = "http://putpeace.com/api/make_payment/" + $localStorage.pk + "/" + response.razorpay_payment_id + "/"
                            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    
                            $scope.caputurePay(captureURL,fh);
                          },
                          "prefill": {
                              "name": $localStorage.fullName,
                              "email": $localStorage.email
                          },
                          "notes": {
                              "address": "Hello World"
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
                  $('#amountVal').val("") ;
                  animateValue('balAfter', angular.element(document.querySelector('[ng-controller="doPaymentCtrl"]')).scope().walletBalance, data[0].fields.balance_after, 500);                  
                  $scope.walletBalance = data[0].fields.balance_after;                              
                } ;
              }).error(function(data, status, headers, config) {
           document.getElementById('indNetErr').style.display = 'block';
            }); 
        }        

});
/* end Do payment */













  