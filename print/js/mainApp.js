var app = angular.module('main', ["ngStorage", "ngRoute",'ngMaterial']);

//After page rendering in PDF Page ;
 document.addEventListener("pagesloaded", function(e) {
  PDFCtrl.rendered = true;
    if (!PDFCtrl.docUploaded) {
     PDFCtrl.setPage();
  }
  });

app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.              
                when('/', {
                      template: " ",
                      controller: 'homeCtrl'
                  }).    
                when('/pdf/:PDFID', {
                    template: " ",
                    controller: 'orderMaker'
                }).       
                when('/pdf', {
                      template: " ",
                      controller: 'PDFUploadCtrl'
                  }).
               when('/home', {
                      template: " ",
                      controller: 'homeCtrl'
                  }).
                otherwise({
                    template: " ",
                    redirectTo: '/',
                    controller: 'homeCtrl'
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

app.run(function($rootScope) {
  // you can inject any instance here
  $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
    window.scrollTo(0, 0);
}); 
});

app.controller('loadingCtrl', function($scope) {

});


app.controller('homeCtrl', function($scope) {
  //alert("home Control");
  PDFCtrl.homeMaker();
});



app.controller('orderMaker', function($scope) {
  PDFCtrl.orderMaker();
});

app.controller('PDFUploadCtrl', function($scope,$location) {
  if (!PDFCtrl.selfUpload) {    
    $location.path('/');
  }

  });
app.controller('feedCtrl', function($scope,  $localStorage, $http, $routeParams,$location) {   


});

/* End Feed */



app.controller('PDFCtrl', function($scope, $http, $localStorage,$location) {
      $scope.homeMaker = function() {
        $scope.state = 1;
        document.getElementById('container').style.display = 'block';        
        document.getElementById('PDFMain').style.display = 'none';
      }

      $scope.state = 1
          $scope.nextUpload = function() {
          if ($scope.printerStatus($scope.printer) != "ONLINE") $scope.moPrinter = true;
          else $scope.moPrinter = false;

          if (!$scope.moPrinter) {
            $scope.state= $scope.state +1;
          }
          }
          $scope.fileUpload = function() {
            $scope.preview  = true;
            document.getElementById('fileInput').value = ''; //So that second time upload will be called onchange
           // $('#progress').attr("value", "0");
            PDFCtrl.progressBar = 0;
            document.getElementById('fileInput').click();
          }
            
        PDFCtrl = angular.element(document.querySelector('[ng-controller="PDFCtrl"]')).scope();
        loginCheck($localStorage);
        //Constants


        $scope.config = function() {

        //Cancelling things for second order, aborting timer for 1st order, incase of second
        $scope.abort = true; //This will abort any ongoing requests

        //Mobile Configs
        $scope.mbScreenToggle = "View PDF";
        $scope.pdfSide = true;
        $scope.mbviewPDF(); //This makes toggle to Options screen and makes pdfSide as false;

        document.getElementById('loadingText').style.display = 'block';
        document.getElementById('container').style.display = 'none';        
        document.getElementById('PDFMain').style.display = 'block';

        if ($scope.selfUpload) { 
          document.getElementById('PDFMain').style.visibility = 'hidden';
          document.getElementById('innerLoading').style.display = 'block';   
          //document.getElementById('footer').style.display  = 'none'

        }

        //Loading bar block  
             
        //Configurations
        $scope.description = "";
        $scope.tags = [];
        $scope.cost = 0;
        $scope.backOnBack = "1";
        $scope.print = 1;
        $scope.printVal = "1";
        $scope.firstPage = 1;
        $scope.pagesPerSide = 1; 
        $scope.lastPage = 0; 
        $scope.noOfCopies = 1;
        $scope.comments = "";
        $scope.submitted1 = false; 
        $scope.review= false;
        $scope.navLeft = "Edit";
        $scope.fileID  = 0;
        $scope.navRight = "Print";
        $scope.progressState = "Initiating your print";
        $scope.walletBalance = "-";
        $scope.public = "0";
        $scope.likers = []; //Document likers 

        //Unselect Pages per side radio
        $('input[name=pagesPerSide]').attr('checked',false);
        $scope.nameLabel = "0";
        $scope.showMore = "0";
        $scope.multiPages = "0";

        $scope.fileTags = []; 
        //Resetting Printer 
        PDFCtrl.prevOption = -1

        //Resetting upload
        $scope.sharePDFSubmit = false;
        $scope.onUpload = false;
       // document.getElementById('saveText').style.display = 'block';
       // document.getElementById('btnSpinner').style.display = 'none';                              

        //State 
        $scope.pageState = 1;
        $scope.buttonsNav = true;

        //Make Order Validation variables
        $scope.moDescription = false;
        $scope.moTags = false;
        $scope.moPages = false;
        $scope.moNoOfCopies = false;
        $scope.moPrinter = false;
        //$scope.moBulkError = false;

        //Error Handling for Raspberry
        orderChecker = 0;
        $scope.orderStatus = "IDLE";
        
        regCall = 0;
        queCall = 0;
        progCall = 0;
        $scope.timeOutError = false;

        //Bubble colors class maintainance 
        registered = false;
        queue = false;
        inProgress = false;
        Done = false;

        $scope.compressError = false;
        $scope.uploadProgress= true; 

        //page rendering
        $scope.rendered = false;
        $scope.docUploaded = false;

        //Timer 
        totalPrintTime = 3;
        $scope.timer = false;
        $scope.timerDone = false;        

        //Compression error
        $scope.doCompress = false;
                  

        //Clearing the search Bar
        if (angular.element(document.querySelector('[ng-controller="Header"]')).length > 0) {
            angular.element(document.querySelector('[ng-controller="Header"]')).scope().clearQueryText();
          }        
        //Set printer

        //GET Printerss
        checkPrintStatus = true;
     

        //Page
        breakTryingPages = false;

        }
        
        $scope.getPrinters = function() {
                  //GET Printerss
        $http.get("http://iitm.cloudapp.net/api/droppoints/").success(function(data, status, headers, config) {
           PDFCtrl.dropPoints = data;
             //Setting for the first time
             if (PDFCtrl.printer == null && $localStorage.last_droppoint != null)  {
             PDFCtrl.printer = $localStorage.last_droppoint;                                                    
             } 
            

            safeApply($scope, $scope.setPrinterZero);
            setTimeout(function() {
             safeApply($scope, $scope.setActualPrinter);
               }, 20);         
            
          if (checkPrintStatus==true)  {
            setTimeout(function() {
              $scope.getPrinters();
               }, 10000);          
          }


         
        }).error(function(data, status, headers, config) {
           document.getElementById('netErr').style.display = 'block';
            });

        }
        checkPrintStatus = true;
         $scope.getPrinters();


        $scope.setPrinterZero = function() {
           if (PDFCtrl.printer != null) {
            PDFCtrl.prevOption = PDFCtrl.printer ;
            PDFCtrl.printer = 0;
           }
        }

        $scope.setActualPrinter = function() {
          if (PDFCtrl.prevOption != -1)  {
            PDFCtrl.printer = PDFCtrl.prevOption ;         
        }        
      }

      
        $scope.orderMaker  = function() {
        if (location.hash.split("/")[1]=="pdf") {
          if (typeof(parseInt(location.hash.split("/")[2])) == "number") {
            $scope.setExistingFile();
          }

        }
        }

        $scope.printSides = function() {
          if ($scope.backOnBack == "1") return "Yes";
          return "No";
        }
        

        $scope.setSelfUpload = function() {
          PDFCtrl.selfUpload = true;
          //$('#viewerSide').addClass("mb-viewer-hidden");

          //add mobile pdf view go down visible class
         // $scope.pdfOwner = fullNameStyler($localStorage.fullName) ; 
          $scope.config();
          $scope.$apply();
          $location.path('/pdf');                    
        }

        $scope.setExistingFile = function() {
          docSource = "shared";
          $scope.selfUpload = false;          
          $scope.config();
          $scope.startIndex = 0;
          $scope.nameLabel = "1";
          $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

             $http.get('http://iitm.cloudapp.net/api/get_pdf/' + location.hash.split("/")[2] + "/").success(function(data, status, headers, config) {
                PDFCtrl.pageState = 1; 
                PDFCtrl.description = data[0].fields.description;
                PDFCtrl.startIndex = 0;
                PDFCtrl.oldFile = true;
                PDFCtrl.fileID = location.hash.split("/")[2];
                PDFCtrl.fileTags = data[0].fields.tags;
                PDFCtrl.likers = data[0].fields.likers;
                PDFCtrl.lastPage = data[0].fields.total_pages;
                PDFCtrl.totalPages = data[0].fields.total_pages;
                PDFCtrl.setCosts();                
                //var fileUrl = "http://putpeace.com/media/" + data[0].fields.pdf ;
               
                var fileUrl = data[0].fields.blob_url;
                console.log(fileUrl + " is file url");
                get_filesize(fileUrl, function(size) {
                    errorFileCheck(size);
                    //alert(size);
                });                

                //PDFView.open("http://iitm.cloudapp.net/media/" + data[0].fields.pdf);
                PDFView.open(fileUrl);


                var fh = new FormHelper();
                fh.append("security_key", $localStorage.security_key);  
                fh.append("ids",data[0].fields.owner)
                $http.post("http://iitm.cloudapp.net/api/get_users/" + $localStorage.pk + "/", fh.data).success(function(user, status, headers, config) {                  
                  PDFCtrl.pdfOwner = fullNameStyler(user[0].fields.name);
                  PDFCtrl.helpScore  = user[0].fields.Help_score;
                  document.getElementById('load').style.visibility="hidden";
                  document.getElementById('contents').style.visibility="visible";
            });
          }).error(function(data, status, headers, config) {
           document.getElementById('netErr').style.display = 'block';
            });                

        }



          $scope.writeStatus = function(status, condition) {
            if (status == "ONLINE" && condition)
              return "ACTIVE";
            return "BUSY";
          }

          $scope.printerStatus = function(id) {
            for (var i=0;i<$scope.dropPoints.length; i++) {
             if ($scope.dropPoints[i].pk == id) {
                            if ($scope.dropPoints[i].fields.status == "ONLINE" &&$scope.dropPoints[i].fields.condition == true)  {
                              return $scope.dropPoints[i].fields.status;
                            }
                            else {
                              return "OFFLINE";
                            }
                            }              
            }
          }

          $scope.printerClass = function(param, cond) {
            if (param == "ONLINE" && cond) 
              return "label-success";
            return "label-danger";
          }

          $scope.printerState = function(param, cond) {
            if (param == "ONLINE" && cond) 
              return "img/greendot.svg";
            return "img/reddot.svg";
          }

        $scope.changePageTo = function(param) {
          if (param == 'start') {
              PDFViewerApplication.page = $scope.firstPage;
          } else if (param == 'end') {
              PDFViewerApplication.page = $scope.lastPage;
          }
          $scope.setCosts();
        }

        $scope.setCost = function() {
            $scope.$apply(function() { 
              $scope.cost = $scope.costFinder();
              });
        }

        $scope.setCosts = function() {
              $scope.cost = $scope.costFinder();
        }

        $scope.printDoc = function() {
          if ($scope.printVal == "1") {
              $scope.print = 1
              $scope.buttonsNav = true;
            } else if ($scope.printVal == "0") {
              $scope.print = 0;
              $scope.buttonsNav = false;

            }
        }

        $scope.prevPage = function() {
              $scope.pageState = $scope.pageState -1; 

              if ($scope.pageState == 1) {
                  $scope.navRight = "Print";
                  $scope.review = false;
              }

              if ($scope.pageState == 2) {
                  $scope.navLeft = "Edit";
                  $scope.navRight = "Pay " + $scope.cost +" INR";
                  $scope.review = true;

              }

              if ($scope.pageState == 3) {
                  //// $scope.order();
                  //if ($scope.cost-$scope.walletBalance>)
                  $scope.navLeft = "Review"
              }

              if ($scope.pageState == 4) {
                  $scope.buttonsNav = false; //Hiding the buttons (Next, Cancel)
              }
                  
        }

        $scope.commonFieldCheck = function() {
          /* 
          //Bulk Error
          if ($scope.totalPrintingPages>200) $scope.moBulkError = true;
          else $scope.moBulkError = false; */ 

          if ($scope.printerStatus($scope.printer) != "ONLINE") $scope.moPrinter = true;
          else $scope.moPrinter = false;
           
          if ($scope.firstPage != parseInt($scope.firstPage, 10) || $scope.lastPage != parseInt($scope.lastPage, 10) || $scope.lastPage > $scope.totalPages)
            $scope.moPages = true;
          else 
            $scope.moPages = false;
          if ($scope.noOfCopies == parseInt($scope.noOfCopies,10) && $scope.noOfCopies > 0) 
            $scope.moNoOfCopies = false;
          else 
            $scope.moNoOfCopies = true;

          if ($scope.moPages|| $scope.moNoOfCopies || $scope.moPrinter || $scope.costFinder() < 0.5 || $scope.doCompress == true) 
              return false;
          return true;
        };        

        $scope.selfUploadCheck = function() {

          if ($scope.public == "1" && ($scope.description == "" || $scope.description.length < 10|| $scope.description.length > 120))
            $scope.moDescription = true;
          else $scope.moDescription = false;

          if ($scope.public == "1" && ($scope.tags.length < 2 || $scope.tags.length > 5)) $scope.moTags = true;
          else $scope.moTags = false;

          if (!$scope.moDescription && !$scope.moTags) return true;
          return false;
        }
        
        $scope.nextPage = function() {
              switch ($scope.pageState) {
                case 1:
                  $scope.submitted1 = true;
                  break;
                case 2:
                  $scope.submitted2 = true;
                  break;
                case 3:
                  $scope.submitted3 = true;
                  break;
                }
                
              //Validations
              if ($scope.pageState == 1) {
                if ($scope.selfUpload == true) {
                  //Add description and tags stuff here
                  if (!$scope.selfUploadCheck()) return;
                } 

                if (!$scope.commonFieldCheck()) return;    

                  //Calculate estimated time for printing
                  $scope.printTimeCalc();
                  //If Validated then check balance and then load next page;
                  document.getElementById('rgtBtn').style.display = 'none';
                  document.getElementById('rgtLoading').style.display = 'block';      
                  document.getElementById('printSpinner').style.display = 'block';                                                                                              
                  var uid = $localStorage.pk;
                  var fh = new FormHelper();
                  fh.append("security_key", $localStorage.security_key);                       
                  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";    

                  $http.post("http://iitm.cloudapp.net/api/get_user/" + uid + "/",fh.data).success(function(data, status, headers, config) {
                        PDFCtrl.walletBalance = data[0].fields.account_balance;
                        $scope.navRight = "Pay " + $scope.cost +" INR";
                        $scope.navLeft = "Edit";
                        $scope.review = true;                                                
                        document.getElementById('rgtBtn').style.display = 'block';
                        document.getElementById('rgtLoading').style.display = 'none';                                                    
                        document.getElementById('printSpinner').style.display = 'none';
                        $("#rgtBtn").removeClass("stdBtn");
                        $scope.pageState = $scope.pageState  + 1; 
                  }).error(function(data, status, headers, config) {
           document.getElementById('netErr').style.display = 'block';
            });
                  return;
              }

              //Validations ends here
              $scope.pageState = $scope.pageState  + 1; 
              if ($scope.pageState == 3) {
                  $scope.navLeft = "Review"
                   if ($scope.walletBalance - $scope.cost >= 0) { 
                   //if ($scope.walletBalance >= $scope.cost) { 
                    $scope.pageState = 4;
                    $scope.buttonsNav = false; //Hiding the buttons (Next, Cancel)
                    //Check the fileUpload and then do order
                    $scope.fileUploadCheck();
                  //}
                  } 
              }

              if ($scope.pageState == 4) {
                  
                  $scope.buttonsNav = false; //Hiding the buttons (Next, Cancel)
              }                
        }

        $scope.multiPagesPerSide = function() {
          $('input[name=pagesPerSide]').attr('checked',false);
          $scope.pagesPerSide = 1;
          $scope.setCosts();
        }


        $scope.fileUploadCheck = function() {
          if ($scope.fileID == 0) {
              $scope.selfUpload = false;
              $scope.progressState = "Uploading the document";
              $scope.uploadProgress= true;
              setTimeout(function() { $scope.fileUploadCheck();  }, 2000);
            } else if ($scope.fileID > 0) {
              //Initiating order
              $scope.orderInitiate(); //Order Initiating screen with running animation for bubbles
              $scope.order();
            }

        }

        $scope.costFinder =  function() {
              $scope.totalPrintSides = $scope.lastPage - $scope.firstPage + 1;
              $scope.totalPrintSides = Math.ceil($scope.totalPrintSides/$scope.pagesPerSide);
              var COST_PER_SIDE = 0.5; 
              var totalCost = COST_PER_SIDE*$scope.totalPrintSides;
              if ($scope.backOnBack == "0") {
                totalCost  = totalCost*2 ; //Cost on printing on side per sheet
              }
              totalCost = Math.round(totalCost) ;
              totalCost = totalCost*$scope.noOfCopies;
              $scope.totalPrintingPages = $scope.totalPrintSides*$scope.noOfCopies;
              if (totalCost < 0) {
                return null;
              }
              return totalCost;
        }

        $scope.caputurePay = function(captureURL,fh) {
              $http.post(captureURL, fh.data).success(function(data, status, headers, config) {  
                if (data == 'Unable to capture try again.') {
                  $scope.caputurePay();
                } else if (data == 'Bad request!') {
                  alert("There is an issue with your payment method, Please contact Madhu(+91 7418991535) for help");
                }
                if (data[0].fields.amount== $scope.amount) {
                  $scope.order();
                  PDFCtrl.buttonsNav = false; //Hiding the buttons (Next, Cancel)
                  $('#amountVal').val("") ;
                  animateValue('balAfter', PDFCtrl.walletBalance, data[0].fields.balance_after, 500);
                  PDFCtrl.walletBalance = data[0].fields.balance_after;
                  PDFCtrl.$apply();
                  setTimeout(function() { $scope.pageState = 4;  }, 2000);

                                                         
                } ;
              }).error(function(data, status, headers, config) {
                  document.getElementById('netErr').style.display = 'block';
            });             
        }

        
        $scope.paymentCheck = function() {

            if ($scope.walletBalance + parseInt($scope.amount) < $scope.cost) 
              {
                $scope.paymentErr = true;
                return ;
              } else {
                $scope.paymentErr  = false;
              }
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

        $scope.openUrl = function(url) {
          $location.path(url);
        }

  
//SendFile
          $scope.sendFile = function(file, drag) {
            var serverUrl = 'http://iitm.cloudapp.net/api/upload_pdf/' + localStorage.getItem('ngStorage-pk') + '/';
            var pdfType = "pdf";
            if (!notExtension('fileInput', ['.doc','docx','.fodt','.odt','.html','.ott','.rft','.stw','.sxw','.txt','.uot','.xml', '.jpg','jpeg','.png'])) {
                alert("Please upload only PDF, Try Google drive to convert");
                  return false;
              }

            var formdata = new FormData();
            formdata.append("security_key", $localStorage.security_key);          
            formdata.append("total_pages", 0); //Change this field
            if (drag == true) {
              formdata.append('pdf_file', file);
            } else {
              jQuery.each($('#fileInput')[0].files, function(i, filePDF) {
               formdata.append('pdf_file', filePDF);
              });
            };

           jqDocSend =  $.ajax({
              type: 'post',
              url: serverUrl,
              data: formdata,
              success: function (data) {
                //$scope.fileID 
                PDFCtrl.fileID = data[0].pk;
                //Show no of pages, if not yet rendered 
                $scope.docUploaded = true;
                if (!$scope.rendered) {
                  $scope.setPage();      
                  }       
                if ($scope.sharePDFSubmit) {
                  $scope.sharePDFSubmit = false;
                  PDFCtrl.sharePDF();
                  }                  
              },
              xhr: function()
              {
                var xhr = new window.XMLHttpRequest();
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                  if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with upload progress
                    //console.log(percentComplete);
                    var total = percentComplete*100 ;
                     //$('#progress').attr("value", total);
                     PDFCtrl.progressBar = total;
                  }
                }, false);
                //Download progress
                xhr.addEventListener("progress", function(evt){
                  if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with download progress
                    //console.log(percentComplete);
                  }
                }, false);
                return xhr;
              },
              processData: false,
              enctype: 'multipart/form-data',
              contentType : false
            }).fail(function( jqXHR, textStatus ) {
     // document.getElementById('netErr').style.display = 'block';
     //Showing no error on failure of request
});;
            return true;
          }


          $scope.order = function() {
            $scope.abort = false; //Once this point reaches, no requests will be cancelled
            if ($scope.selfUpload)
              if (!$scope.selfUploadCheck()) return;  

           var fh = new FormHelper();
           fh.append("security_key", $localStorage.security_key);          
           fh.append("cost",$scope.costFinder());
           fh.append("back_on_back", $scope.backOnBack);
           fh.append("number_of_copies", $scope.noOfCopies);
           fh.append("start_page", $scope.firstPage);
           fh.append("end_page", $scope.lastPage);
           fh.append("comments", $scope.comments);
           fh.append("number_up", $scope.pagesPerSide);
           fh.append("prettyprint",parseInt($scope.nameLabel));
            //$scope.fileID = 3;
           $scope.dropID = $scope.printer;
           $scope.collegeID = 1;
           //Update Last printer in local db
           $localStorage.last_droppoint = $scope.dropID;
           $localStorage.$save();

           var orderUrl = "http://iitm.cloudapp.net/api/make_order/" + $localStorage.pk + "/" + $scope.fileID  + "/" + $scope.collegeID  + "/" + $scope.dropID + "/";
            $http.post(orderUrl, fh.data).success(function(data, status, headers, config) {
               $scope.sharePDFSubmit = false; //Flag to stop multiple clicks
               $scope.orderID = data[0].pk; 
               $scope.progressCheck();
            }).error(function(data, status, headers, config) {
                document.getElementById('netErr').style.display = 'block';
            });;
        }

         $scope.setAmount = function(cost) {
            $scope.amount  = cost;
         }

         $scope.setPage = function() {
            document.getElementById('loadingText').style.display = 'none';          
            if ($scope.selfUpload) {
              $scope.$apply(function() { 
                  $scope.tryPageNum();

              });              
          }

         }


         $scope.tryPageNum = function() {
               if (!breakTryingPages)  {
                  setTimeout(function() {
               if (PDFView.pagesCount != -1) {
                  //drop or uploadButton 
                  $scope.lastPage = PDFView.pagesCount;
                  $scope.totalPages = PDFView.pagesCount; 
                  $scope.setCost();
                  breakTryingPages = true;          
                  angular.element(document.querySelector('[ng-controller="loadingCtrl"]')).scope().docRendering  = false;                  
                  document.getElementById('PDFMain').style.visibility = 'visible';
                  document.getElementById('innerLoading').style.display = 'none';
                 // document.getElementById('footer').style.display  = 'block';                  
               }  else {
                        $scope.tryPageNum();
                      }
                         }, 300);
                  }  
         }

         $scope.dropPointName = function() {
          if (typeof($scope.dropPoints) == "object") {
          for (var i=0;i<$scope.dropPoints.length;i++) {
            if ($scope.dropPoints[i].pk == $scope.printer) {
              return $scope.dropPoints[i].fields.name;
            }
          }
        } else if (typeof($scope.dropPoints) == "undefined") {
          return;
        }
         }

         $scope.orderInitiate = function() {
            //Printer Status to false;
            checkPrintStatus = false;
            $scope.uploadProgress= false;  //If upload progress is showing up still, this closes
            $scope.progressState = "Initiating your print";
                    regCall = regCall + 1;
                    $('.double-bounce1').css('-webkit-animation-play-state','running');
                    $('.double-bounce1').css('animation-play-state', 'running');
                    $('.double-bounce2').css('-webkit-animation-play-state','running');
                    $('.double-bounce2').css('animation-play-state', 'running');  

                  
         }

         $scope.printTimeCalc = function() {


            var prog_time_per_page = 5
            var proc_time_per_page = 10 
            var selectedSides = $scope.lastPage - $scope.firstPage +  1;
            var printPages = selectedSides*$scope.noOfCopies;           
            var download_pages = selectedSides;

            if ($scope.backOnBack == "0") {
              var printPages = (Math.pow((printPages*2),0.7))*4 ; 
              download_pages = Math.pow(download_pages, 0.85);
            }
            else if ($scope.backOnBack == "1") {
              var printPages = (Math.pow((printPages),0.7))*4;  
              download_pages = Math.pow(download_pages, 0.85)*2;
            }

            var queuedTime = prog_time_per_page*download_pages;
            var inProgressTime = proc_time_per_page*printPages;
            totalPrintTime = Math.floor(queuedTime + inProgressTime) + 5 ;  
              
            var seconds = totalPrintTime - Math.floor(totalPrintTime/60)*60 ;
            var minutes = Math.floor(totalPrintTime/60)
            $scope.timerString = minutes.toString() + " min " + seconds.toString() + " sec";                                  
            if (minutes == 0) {
              $scope.timerString = seconds.toString() + " sec";
            }            

         }

         $scope.initiateTimer = function() {
            $scope.timer = true;
            
            var prog_time_per_page = 5
            var proc_time_per_page = 10 
            var selectedSides = $scope.lastPage - $scope.firstPage +  1;
            var printPages = selectedSides*$scope.noOfCopies;  
            var download_pages = selectedSides;
            
            if ($scope.backOnBack == "0") {
              var printPages = (Math.pow((printPages*2),0.7))*4 ; 
              download_pages = Math.pow(download_pages, 0.85);
            }
            else if ($scope.backOnBack == "1") {
              var printPages = (Math.pow((printPages),0.7))*4;  
              download_pages = Math.pow(download_pages, 0.85)*2;
            }

            var queuedTime = prog_time_per_page*download_pages;
            var inProgressTime = proc_time_per_page*printPages;
            totalPrintTime = Math.floor(queuedTime + inProgressTime) + 5 ;                        
            $scope.updateTimerString()
            totalPrintTime = totalPrintTime - 1;
            $scope.timerRun();                        
            if(!$scope.$$phase) {
              $scope.$apply();
            }
              
         }

         $scope.timerRun = function() {
          if (!$scope.abort) {
          if (totalPrintTime> 0) {
           setTimeout(function() {
              $scope.updateTimerString();
              totalPrintTime = totalPrintTime - 1;
              $scope.timerRun();
             }, 1000);   
          } else {
            $scope.timerDone = true;
            }
          }
         }

         $scope.updateTimerString = function() {

            var seconds = totalPrintTime - Math.floor(totalPrintTime/60)*60 ;
            var minutes = Math.floor(totalPrintTime/60)
            $scope.timerString = minutes.toString() + " min " + seconds.toString() + " sec";
            if (minutes == 0) {
              $scope.timerString = seconds.toString() + " sec";
            }
            if(!$scope.$$phase) {
              $scope.$apply();
            }
         }

         $scope.progressCheck = function() { 
          if ($scope.timeOutError || $scope.abort) return;


            $http.get('http://iitm.cloudapp.net/api/get_order_status/' + $scope.orderID + '/').success(function(data, status, headers, config) {

          if ($scope.orderStatus == "REGISTERED" && (data[0] == "QUEUED" || data[0] == "IN_PROGRESS")) {
              $scope.initiateTimer();                                
          }

          if (data[0] != "CONTINUE" && data[0] != "ERROR") {
            $scope.orderStatus = data[0];
          } 

              if ($scope.orderStatus != "DONE" && data[0] != "ERROR") {

                switch ($scope.orderStatus) {
                  case "REGISTERED":
                    $scope.orderInitiate();

                    break;
                  case "QUEUED":
                    $scope.progressState = "Your print job is queued";
                    queCall = queCall + 1;
                    break;
                  case "IN_PROGRESS":
                    $scope.progressState = "Your print job is in progress currently";
                    progCall = progCall +1;
                    break;
                }

               setTimeout(function() {
                PDFCtrl.progressCheck();
                 }, 2000);
              } else if (data[0] == "DONE") {
                $scope.timer = false;
                $scope.progressState =  "Job is finished, Please collect it ASAP from " + $scope.dropPointName()  + " before the papers get stacked up !";                
                $('.double-bounce1').css('-webkit-animation-play-state','paused');
                $('.double-bounce1').css('animation-play-state', 'paused');
                $('.double-bounce2').css('-webkit-animation-play-state','paused');
                $('.double-bounce2').css('animation-play-state', 'paused');
              } else if (data[0] == "ERROR") {
                $scope.timer = false;

                if ($scope.orderStatus == "IN_PROGRESS" || $scope.orderStatus == "QUEUED") {
                  $scope.compressError = true;
                }
                if ($scope.orderStatus == "ILDE" || $scope.orderStatus == "REGISTERED") {
                  $scope.timeOutError = true;
                }

                //Assigning orderStatus in errorState()
                $scope.errorState();
              }          
          
          }).error(function(data, status, headers, config) {
                document.getElementById('netErr').style.display = 'block';
            });         

      }

      $scope.errorState = function() {
                $scope.orderStatus = "ERROR";
                $scope.progressState = " Oops! Error occured while printing. Your bill amount of Rs."+ $scope.cost + " will be credited back to your putpeace wallet ";

                //Bubble Animation stop
                $('.double-bounce1').css('-webkit-animation-play-state','paused');
                $('.double-bounce1').css('animation-play-state', 'paused');
                $('.double-bounce2').css('-webkit-animation-play-state','paused');
                $('.double-bounce2').css('animation-play-state', 'paused');   
                $scope.$apply();                
      }


        $scope.mbviewPDF = function() {
          if (!$scope.pdfSide) {
            $scope.pdfSide = true;
            //$('#viewerSide').css('display','block');
            $('#viewerSide').removeClass('render-down');
            $scope.mbScreenToggle = "Close";
            $('#formSide').css('display','none');
          } else if ($scope.pdfSide) {
            $scope.pdfSide = false;
            $scope.mbScreenToggle = "View PDF";
            $('#formSide').css('display','block');
             //$('#viewerSide').css('display','none');
             $('#viewerSide').addClass('render-down');
          }
        }      

});        


//Invoked on attaching file
function onFileAttached() {
  var fullPath = document.getElementById('fileInput').value;
  if (fullPath != "null") {
            angular.element(document.querySelector('[ng-controller="loadingCtrl"]')).scope().docRendering  = true;
            var checkExt = PDFCtrl.sendFile("noDrag",false);
            if (checkExt == false) {
              return;
            }
            docSource = "uploadButton";
            PDFCtrl.setSelfUpload();
//            window.location.hash = 'pdf';
            errorFileCheck(-1);
  }
}






//Directives


    // -------------------------------------------------- //
    // -------------------------------------------------- //


    // To make the HTML menu easier to use, we're not requiring the user to add the
    // ngModel directive. Instead, we're going to transform the bnDropdown attribute
    // into an ngModel attribute. This requires us to compile with the TERMINAL
    // setting so that we can get the ngModel directive to compile after we've added
    // it to the element.
    app.directive(
      "bnDropdown",
      function( $compile ) {

        // Return the directive configuration.
        // --
        // NOTE: ngModel compiles at priority 1, so we will compile at priority 2.
        return({
          compile: compile,
          priority: 2,
          restrict: "A",
          terminal: true
        });


        // I compile the bnDropdown directive, adding the ngModel directive and
        // other HTML and CSS class hooks needed to execute the dropdown. This
        // assumes that all directives are present (ie, you can't render the
        // dropdown using an ngInclude or any other asynchronous loading).
        function compile( tElement, tAttributes ) {

          // Add the ngModel directive using the attribute value of the main
          // directive. This just makes it easier to use (and look nicer in
          // my opinion).
          if ( ! tAttributes.ngModel ) {

            tElement.attr( "ng-model", tAttributes.bnDropdown );

          }

          // Prepend the root of the menu (where the selected value is shown
          // when the menu options are hidden).
          tElement.prepend(
            "<div class='dropdown-root'>" +
              "<div class='dropdown-label'></div>" +
            "</div>"
          );

          // Add CSS hooks. Since we're in the compiling phase, these CSS hooks
          // will automatically be picked up by any nested ngRepeat directives;
          // that's what makes the compile phase (and AngularJS) so player!
          tElement
            .addClass( "m-dropdown" )
            .children( "ul" )
              .addClass( "dropdown-options" )
              .children( "li" )
                .addClass( "dropdown-option dropdown-label" )
          ;

          if ( tAttributes.caret ) {

            tElement.addClass( "dropdown-caret" );

          }

          // Since we're using TERMINAL compilation, we have to explicitly
          // compile and link everything at a lower priority. This will compile
          // the newly-injected ngModel directive as well as all the nested
          // directives in the menu.
          var linkSubtree = $compile( tElement, null, 2 );

          return( link );


          // When the dropdown is linked, we have to link the explicitly
          // compiled portion of the DOM.
          function link( scope ) {

            linkSubtree( scope );

          }

        }

      }
    );


    // Now that we've compiled the directive (in the above priority), we need to work
    // with the ngModelController to update and reactive to View-Model changes.
    app.directive(
      "bnDropdown",
      function( $parse, $document ) {

        // Return the directive configuration.
        return({
          link: link,
          require: "ngModel",
          restrict: "A"
        });


        // I bind the JavaScript events to the local scope.
        function link( scope, element, attributes, ngModelController ) {

          // Cache DOM references.
          // --
          // NOTE: We are NOT caching the LI nodes as those are dynamic. We'll
          // need to query for those just-in-time when they are needed.
          var dom = {
            module: element,
            root: element.find( "div.dropdown-root" ),
            rootLabel: element.find( "div.dropdown-root div.dropdown-label" ),
            options: element.find( "ul.dropdown-options" )
          };

          // I am the value that will be put in the menu root if we cannot
          // find an option with the matching ngModel value.
          var placeholder = ( attributes.placeholder || "&nbsp;" );

          // When the user clicks outside the menu, we have to close it.
          $document.on( "mousedown", handleDocumentMouseDown );

          // When the user clicks the root, we're going to toggle the menu.
          dom.root.on( "click", handelRootClick );

          // When the user clicks on an option, we're going to select it.
          // This must use event delegation (only available in jQuery) since
          // the options are dynamic.
          dom.options.on( "click", "li.dropdown-option", handleOptionClick );

          // When the scope is destroyed, we have to clean up.
          scope.$on( "$destroy", handleDestroyEvent );

          // When the ngModel value is changed, we'll have to update the
          // rendering of the dropdown menu to reflect the ngModel state.
          ngModelController.$render = renderSelectedOptionAsync;


          // ---
          // PUBLIC METHODS.
          // ---


          // I clean up the directive when it is destroyed.
          function handleDestroyEvent() {

            $document.off( "mousedown", handleDocumentMouseDown );

          }


          // I handle the mouse-down event outside the menu. If the user clicks
          // down outside the menu, we have to close the menu.
          function handleDocumentMouseDown( event ) {

            var target = angular.element( event.target );

            // NOTE: .closest() requires jQuery.
            if ( isOpen() && ! target.closest( dom.module ).length ) {
              hideOptions();

            }

          }


          // I handle the selection of an option by a user.
          function handleOptionClick( event ) {

            // When the user selects an option, we have to tell the
            // ngModelController. And, since we are changing the View-Model
            // from within a directive, we have to use $apply() so that
            // AngularJS knows that something has been updated.
            scope.$apply(
              function changeModel() {

                hideOptions();

                var option = angular.element( event.target );

                ngModelController.$setViewValue( getOptionValue( option ) );

                // $setViewValue() does not call render explicitly. As
                // such we have to call it explicitly in order to update
                // the content of the menu-root.
                renderSelectedOption();

              }
            );

          }


          // I toggle the dropdown options menu.
          function handelRootClick( event ) {

            isOpen() ? hideOptions() : showOptions() ;

          }


          // I get called implicitly by the ngModelController when the View-
          // Model has been changed by an external factor (ie, not a dropdown
          // directive interaction). When this happens, we have to update the
          // local state to reflect the ngModel state.
          function renderSelectedOptionAsync() {

            // Since the options may be rendered by a dynamically-linking
            // directive like ngRepeat or ngIf, we have to give the content
            // a chance to be rendered before we try to find a matching
            // option value.
            // --
            // Since ngModel $watch() bindings are set up in the
            // ngModelController, it means that they are bound before the DOM
            // tree is linked. This means that the ngModel $watch() bindings
            // are bound before the linking phase which puts the ngRepeat and
            // ngIf $watch() bindings at a lower priority, even when on the
            // same Scope instance, which is why we have to render asynchronously,
            // giving ngRepeat and ngIf a chance to react to $watch() callbacks.
            // The more you know!
            scope.$evalAsync( renderSelectedOption );

          }


          // ---
          // PRIVATE METHODS.
          // ---


          // I determine if the options menu is being shown.
          function isOpen() {

            return( dom.module.hasClass( "dropdown-open" ) );

          }


          // I find rendered option with the given value. This evaluates the
          // [option] attribute in the context of the local scope and then
          // performs a direct object reference comparison.
          function findOptionWithValue( value ) {

            // Since the options are dynamic, we have to collection just-in-
            // time with the selection event.
            var options = dom.options.children( "li.dropdown-option" );

            for ( var i = 0, length = options.length ; i < length ; i++ ) {

              var option = angular.element( options[ i ] );

              if ( getOptionValue( option ) === value ) {

                return( option );

              }

            }

            return( null );

          }


          // I get the value of the given option (as evaluated in the context
          // of the local scope associated with the option element).
          function getOptionValue( option ) {

            var accessor = $parse( option.attr( "option" ) || "null" );

            return( accessor( option.scope() ) );

          }


          // I hide the options menu.
          function hideOptions() {

            dom.module.removeClass( "dropdown-open" );

          }


          // I update the dropdown state to reflect the currently selected
          // ngModel value.
          function renderSelectedOption() {

            // Find the FIRST DOM element that matches the selected value.
            var option = findOptionWithValue( ngModelController.$viewValue );

            // Remove any current selection.
            dom.options.find( "li.dropdown-option" )
              .removeClass( "dropdown-selection" )
            ;

            // If we found a matching option, copy the content to the root.
            if ( option ) {

              dom.rootLabel
                .removeClass( "dropdown-placeholder" )
                .html( option.html() )
              ;

              option.addClass( "dropdown-selection" );

            // If we have no matching option, copy the placeholder to the root.
            } else {

              dom.rootLabel
                .addClass( "dropdown-placeholder" )
                .html( placeholder )
              ;

            }

          }

          // I show the options menu.
          function showOptions() {

            dom.module.addClass( "dropdown-open" );

          }

        }

      }
    );




//Google drive uploads doc files converted to pdf without any extension, need to recognize such files and then upload
function notExtension(inputID, exts) {
    var fileName = document.getElementById(inputID).value;
    return !(new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName); 
}




function get_filesize(url, callback) {
    var xhr = new XMLHttpRequest(); 
    
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
                                 //  to get only the header
    //xhr.setRequestHeader('Origin', 'www.putpeace.com');                                 
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            callback(parseInt(xhr.getResponseHeader("Content-Length")));
        }
    };
    xhr.send();
}

function errorFileCheck(param) {
  if (docSource == "uploadButton") {
  var filesize = $('#fileInput')[0].files[0].size;
  } else { //Cases  of drop and shared docs
    var filesize = param;
  }
  

  var filesizeMB = filesize/(1024*1024);
  var sizePerPage = filesizeMB/PDFCtrl.totalPages;

  if (filesizeMB > 64) {
    PDFCtrl.doCompress = true;
  }

  if (sizePerPage > 0.5 && PDFCtrl.totalPages > 15) {
     PDFCtrl.doCompress = true;
  }
}

//Notice
function openNotice() {
   PDFCtrl.openUrl('pdf/2165') ;
}

//OBJECT Watch start

// object.watch
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop, handler) {
      var
        oldval = this[prop]
      , newval = oldval
      , getter = function () {
        return newval;
      }
      , setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
      }
      ;
      
      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
            get: getter
          , set: setter
          , enumerable: true
          , configurable: true
        });
      }
    }
  });
}

// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}


//OBJECT Watch end

function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}

