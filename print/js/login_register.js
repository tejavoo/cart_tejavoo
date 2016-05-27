app.constant('API_SERVER', 'http://iitm.cloudapp.net/api/');
app.controller('registerCtrl', function($scope, $localStorage,$http, $location,afterLogin) {
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

        });



app.controller('loginCtrl',function($scope, $localStorage, $http,$location, afterLogin) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $scope.email = "";
        $scope.password = "";
        $scope.invalidCredentials = false;

        if (typeof($localStorage.security_key) != "undefined") {
              window.location = "mainApp.html?rel=aacf59ec0f";
        }
        

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
                    window.location = "mainApp.html?rel=aacf59ec0f"
    }
  };
});
