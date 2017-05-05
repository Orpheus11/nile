define(['dashboard/module', 'lodash', 'jquery'], function (module) {

    'use strict';

    module.registerController('DashboardCtrl', function ($scope,$modal,$log,$interval, CalendarEvent,dashboardService) {

        dashboardService.listHistory(function(data) {
            $scope.history = data;
        });

        dashboardService.dashboardInfo(function(data) {
            $scope.dashboard_info = data;
        });

        dashboardService.outside_servers(function(data) {
            $scope.outside_servers = data;
        });

        dashboardService.dashboardCenters(function(data) {
            $scope.centers = data;
        });

        $scope.showHistory = function(){
            var modalInstance = $modal.open({
                templateUrl: 'app/dashboard/detailHistory.tpl.html',
                windowClass: 'app-modal-window',
                controller: function($scope,$modalInstance){
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }

                    modalInstance.result.then(function () {
                        $log.info('Modal closed at: ' + new Date());
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            })
        }
    });

    module.registerFilter('timeLineDate',function(){
        var filterDate = function(time){
            var formTime = new Date(time);
            var month = formTime.getMonth()+1;
            var date = formTime.getDate();
            var formDate = month+"月"+date+"日";
            return formDate;
        }
        return filterDate;
    });

    module.registerFilter('timeLineTime',function(){
        var filterTime = function(time){
            var formTime = new Date(time);
            var hour = formTime.getHours();
            var minute = formTime.getMinutes();
            var formMinute;
            if(parseInt(minute)<10){
                formMinute = '0'+minute;
            }else{
                formMinute = minute;
            }
            var times = hour+":"+formMinute;
            return times;
        }
        return filterTime;
    });

    module.registerFilter('newTime',function(){
        var filterNewTime = function(time){
            var formTime = time.substring(0,10)+" "+time.substring(11,19);
            return formTime;
        }
        return filterNewTime;
    })

});
