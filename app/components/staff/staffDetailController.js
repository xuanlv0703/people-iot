"use strict";
app.controller('staffDetailCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService) {
        var host = ConfigService.host;
        var staffId = $state.params.staffId;

        $scope.getStaffInfo = function() {
            $http.get(host + '/api/staff/getStaffById/' + staffId).then(function(response) {
                $scope.staff = response.data.data[0];
                $scope.firstname = response.data.data[0].firstname;
                $scope.lastname = response.data.data[0].lastname;
                $scope.gender = response.data.data[0].gender;
                $scope.department = response.data.data[0].department;
                $scope.title = response.data.data[0].title;
                $scope.email = response.data.data[0].email;
                $scope.phonenumber = response.data.data[0].phonenumber;
                $scope.picFile = response.data.data[0].avatar;
                $scope.experience = response.data.data[0].experience;
                $scope.bloodtype = response.data.data[0].bloodtype;
                $scope.diet = response.data.data[0].diet;
                $scope.adicted = response.data.data[0].adicted;
                $scope.drug = response.data.data[0].drug;
                $scope.metalemotionhealth = response.data.data[0].metalemotionhealth;
                $scope.position = response.data.data[0].position;
                $scope.training = response.data.data[0].training;
            });
        }
    }
]);
