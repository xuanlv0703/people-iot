var app = angular.module('peopleIotApp', ['ui.router', 'datatables', 'angular-md5','ngFileUpload',
    'ui.bootstrap.datetimepicker','ui-notification']);
app.factory('ConfigService', [function() {
    return {
        host: 'http://api-rutledge.apps.openshift.rasia',
        host_socketio: 'http://172.16.0.115:9003'
    };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $state, $window) {
        if ($window.localStorage.token != undefined) {
            $httpProvider.defaults.headers.common['x-access-token'] = $window.localStorage.token;
        }
        return {
            'response': function(response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function(rejection) {
                if (rejection.status === 403) {
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);
