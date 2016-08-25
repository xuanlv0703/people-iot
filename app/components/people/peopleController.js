"use strict";
app.controller('peopleListing', ['$scope', '$http', '$timeout', 'ConfigService', '$window',
    function($scope, $http, $timeout, ConfigService, $window) {
        var host = ConfigService.host;
        var pagenumber = 1;
        var itemsPerPage = 10;

        $scope.showMore = function(itemsPerPage) {
            $http.get(host + '/api/staff/countStaff').then(function(response) {
                if (response.data.data[0].total < itemsPerPage) {
                    $scope.itemsPerPage = response.data.data[0].total;
                }else{
                    $scope.itemsPerPage = itemsPerPage;
                }
            })
            $http.get(host + '/api/staff/getStaffLimit/' + itemsPerPage).then(function(response) {
                var data = response.data;
                $scope.people_listing = data.data;
                console.log($scope.people_listing);
            })
        }

        $scope.getInfoStaff = function(pagenumber) {
            $http.get(host + '/api/staff/getAllStaff/' + pagenumber + '/' + itemsPerPage).then(function(response) {
                var data = response.data;
                $scope.people_listing = data.data;
                $scope.total_entries = data.statistic.totalStaff;
                if (($scope.total_entries >= 10 && $scope.total_entries <= 20) || $scope.total_entries > 20) {
                    $scope.isShowMore20 = true;
                }
                if ($scope.total_entries > 20 || $scope.total_entries > 40) {
                    $scope.isShowMore20 = true;
                    $scope.isShowMore40 = true;
                }
                $scope.total_page = data.statistic.totalPage;
                if (data.statistic.totalStaff < itemsPerPage) {
                    $scope.itemsPerPage = data.statistic.totalStaff;
                } else {
                    if (pagenumber * itemsPerPage > data.statistic.totalStaff) {
                        $scope.itemsPerPage = data.statistic.totalStaff;
                    } else {
                        $scope.itemsPerPage = pagenumber * itemsPerPage;
                    }
                }
            });
        }

        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };
        $scope.current = 1;

        $scope.nextPage = function(pagenumber) {
            $scope.current = pagenumber;
            $scope.getInfoStaff(pagenumber);
        }

        $scope.btnNextPage = function(current) {

        }

        function tabactions() {
            $('.tabclass').each(function() {
                if ($(this).hasClass('tab-active')) {
                    $(this).removeClass('tab-active');
                }
            });
        }

        $timeout(function() {
            /* Horizontal people listing */
            $('.people-listing.horizontal-list .list-item:nth-child(even) + .list-item').addClass('clear-left-tablet');
            $('.people-listing.horizontal-list:not(.five) .list-item:nth-child(5n) + .list-item').addClass('clear-left');
            $('.people-listing.horizontal-list.five .list-item:nth-child(5n) + .list-item').addClass('clear-left');

            $('.list-view-1').on("click", function() {
                $('.people-listing').addClass("five");
                $('.grid-table').addClass("hide");
                $('.grid-content').removeClass("hide");
                $('.people-listing').removeClass("one");
                tabactions();
                $(this).addClass('tab-active');
            });

            $('.list-view-2').on("click", function() {
                $('.people-listing').addClass("one");
                $('.grid-table').addClass("hide");
                $('.grid-content').removeClass("hide");
                $('.people-listing').removeClass("five");
                tabactions();
                $(this).addClass('tab-active');
            });

            $('.list-view-3').on("click", function() {
                $('.grid-table').removeClass("hide");
                $('.grid-content').addClass("hide");
                tabactions();
                $(this).addClass('tab-active');
            });
        }, 100)
    }
]);
