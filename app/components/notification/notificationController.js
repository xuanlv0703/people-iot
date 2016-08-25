"use strict";
app.controller('notificationCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder','$state','$compile', function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder,$state,$compile) {

    $scope.dtOptions = DTOptionsBuilder.fromSource("assets/data/notification.json")
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('bFilter', false)
        .withOption('bLengthChange', false);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('date').withTitle('Date'),
        DTColumnBuilder.newColumn('time').withTitle('Time'),
        DTColumnBuilder.newColumn('message').withTitle('Message'),
        DTColumnBuilder.newColumn('level').withTitle('Level'),
        DTColumnBuilder.newColumn('action').withTitle('Action')
    ];
}])
