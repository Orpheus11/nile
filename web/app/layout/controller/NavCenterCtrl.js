define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavCenterCtrl', function ($scope,$modal,$log,$http,navCenterService,$rootScope,navConsoleService,navNetworkService,navComputeService,navPolicyService) {
        $scope.AddCenter = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/addCenter.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.addCenter=function(){
                        navCenterService.addCenter($scope.center_name,$scope.center_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Create Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Same Name Exist!</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                            }
                            else{
                                $.smallBox({
                                    title: "Center Created",
                                    content: "<i class='fa fa-clock-o'></i> <i>Center has been Created.</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                $rootScope.$broadcast('updateCenter');
                //$log.info('Modal closed at: ' + new Date());

            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.EditCenter = function (center_id,center_name,center_des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editCenter.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.center_id = center_id;
                    $scope.center_name = center_name;
                    $scope.center_des = center_des;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.editCenter=function(){
                        navCenterService.editCenter($scope.center_id,$scope.center_name,$scope.center_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Edit Center Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Edit Center Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Center Info Has Been Updated</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                $rootScope.$broadcast('updateCenter');
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.DeleteCenter = function (center_id) {
            navComputeService.getServers(center_id,function(data){
                if(data.length>0){
                    alert("数据中心下存在服务器，无法删除数据中心\nServers Exist Under Center.");
                }else{
                    $.SmartMessageBox({
                        title: "Delete Center!",
                        content: "Are You Sure To Delete Center?",
                        buttons: '[No][Yes]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Yes") {
                            navCenterService.deleteCenter(center_id,function(data){
                                $scope.return_data = data;
                                if ($scope.return_data.error != null){

                                    $.smallBox({
                                        title: "Delete Error",
                                        content: "<i class='fa fa-clock-o'></i> <i>Center Not Deleted.</i>",
                                        color: "#C46A69",
                                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                        timeout: 4000
                                    });
                                }
                                else{
                                    $.smallBox({
                                        title: "Center Deleted",
                                        content: "<i class='fa fa-clock-o'></i> <i>Center has been Deleted.</i>",
                                        color: "#659265",
                                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                        timeout: 4000
                                    });
                                    $rootScope.$broadcast('updateCenter');
                                }
                            });
                        }
                        if (ButtonPressed === "No") {
                            $.smallBox({
                                title: "Delete Center Has Been Canceled",
                                content: "<i class='fa fa-clock-o'></i> <i>Delete Center Has Been Canceled</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }

                    });
                }
            })



        };

        $scope.CenterConsole = function (center_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/bindingConsoleServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.center_id = center_id;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.SetSelectedConsole = function(consoleserver){
                        $scope.selected_consoleserver = consoleserver;
                    }
                    navConsoleService.getConsoleServers(function(data){
                        $scope.consoleservers = data;
                    })

                    //console.log($scope.center_id);

                    $scope.bindingConsoleServer=function(){
                        navConsoleService.bindingConsoleServer($scope.center_id,$scope.selected_consoleserver.id,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                //console.log($scope.return_data.error);
                                $.smallBox({
                                    title: "Binding Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Binding Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Binding Console Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Binding Console Server Succeed</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }

                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                $rootScope.$broadcast('updateCenter');
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.ManageNetwork = function (center_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/bindingNetworkServer.tpl.html',
                windowClass: 'app-modal-window',
                controller: function($scope,$modalInstance){
                    $scope.center_id = center_id;
                    $scope.networkServers = navNetworkService.networkServers;
                    $scope.selected_networkserver = navNetworkService.selected_networkserver;
                    navNetworkService.getNetworkServerByCenterId($scope.center_id);
                    navNetworkService.listNetworkServers();
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.SetSelectedNetwork = function(networkserver){
                        $scope.selected_networkserver = networkserver;
                    }
                    console.log($scope.center_id);

                    $scope.bindingNetworkServer=function(){
                        navNetworkService.bindingNetworkServer($scope.center_id,$scope.selected_networkserver.Id,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                console.log($scope.return_data.error);
                                $.smallBox({
                                    title: "Binding Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Binding Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Binding Network Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Binding Network Server Succeed</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }

                        });
                    }

                }
            });
            modalInstance.result.then(function () {
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.SetHighAvailable = function(center_id,servers){
            console.log(center_id);
            console.log(servers);
            //  navComputeService.getCenterVms(center_id,function(data){
            //     var vm_priority_list = data;
            // })
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/highAvailable.tpl.html',
                windowClass: 'app-modal-window',
                controller: function($scope,$modalInstance){
                    navComputeService.getCenterVms(center_id,function(data){
                        $scope.vm_priority_list = data;
                    })
                    navPolicyService.getHaDetail(center_id,function(data){
                        $scope.enable_ha = data.enable_ha;
                        $scope.failover = data.failover;
                        $scope.migrate_back = data.migrate_back;
                        $scope.use_standby = data.use_standby;
                    })
                    $scope.center_id = center_id;
                    // $scope.servers = servers;
                    $scope.isEnableHa = true;
                    $scope.serverChecked = false;
                    $scope.preferred_servers_list = [];
                    // $scope.enable_ha = true;
                    // $scope.setEnableHa = function(isEnable){
                    //     alert(isEnable);
                    //     $scope.enable_ha = !isEnable;
                    // }
                    $scope.setOneMigrate = function(){
                        $scope.migrate_back = false;
                    }
                    // $scope.failover = true;
                    $scope.setFailover = function(){
                        $scope.failover = true;
                    }
                    $scope.unSetFailover = function(){
                        $scope.failover = false;
                    }
                    $scope.setOthersMigrate = function(){
                        $scope.migrate_back = true;
                    }
                    $scope.migrateAll = function(){
                        $scope.use_standby = false;
                    }
                    $scope.migrateChoose = function(){
                        $scope.use_standby = true;
                    }
                    navComputeService.getServers(center_id,function(data){
                        $scope.servers = data;
                        for(var i=0;i<$scope.servers.length;i++){
                            $scope.tempServer = {
                                "server_id":$scope.servers[i].id,
                                "standby_status":$scope.servers[i].standby_status
                            };
                            $scope.preferred_servers_list.push($scope.tempServer);
                        }
                    })
                    $scope.getServerList = function(isEnable,serverId){
                        $scope.standby_status = !isEnable;
                        $scope.serverId = serverId;
                        $scope.preferred_servers = {
                            "server_id": $scope.serverId,
                            "standby_status":$scope.standby_status
                        };
                        for(var j=0;j<$scope.preferred_servers_list.length;j++){
                            if($scope.preferred_servers_list[j].server_id == $scope.preferred_servers.server_id){
                                $scope.preferred_servers_list[j] = $scope.preferred_servers;
                            }
                        }
                    }
                    $scope.getWaitTime = function(){
                        $scope.wait_interval = $scope.waitTime;
                    }
                    $scope.getRetryCount = function(){
                        $scope.retry_count = $scope.retryCount;
                    }
                    $scope.center_type = 1;
                    // $scope.failover = 2;
                    $scope.vm_priority_list = [];
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.setHighAvailable = function(){
                        // console.log("$scope.preferred_servers_list:"+$scope.preferred_servers_list)
                        console.log("$scope.failover:"+$scope.failover);
                        console.log("$scope.use_standby:"+$scope.use_standby);
                        // return
                        navPolicyService.setHighAvailable($scope,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Set High Available",
                                    content: "<i class='fa fa-clock-o'></i> <i>Setting High Available Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "High Available Submit",
                                    content: "<i class='fa fa-clock-o'></i> <i>Setting High Available Submit</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                //$scope.UpdateTree();
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateTree();
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.SetDynamicLoadBalancing = function(center_id){
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/dynamicLoadBalancing.tpl.html',
                windowClass: 'app-modal-window',
                controller: function($scope,$modalInstance){
//------------------------
                    $scope.center_id = center_id;
                    $scope.editFrequencyFlag = true;
                    $scope.removeFrequencyFlag = true;
                    $rootScope.timeList = [];
                    $scope.selectedTimeList = [];
                    navPolicyService.getDwmDetail(center_id,function(data){
                        $scope.enable_dwm = data.enable_dwm;
                        $scope.threshold = data.threshold;
                        $scope.data_period = data.data_period;
                        $scope.frequency = data.frequency;
                        $scope.timeList = data.timeList;
                        $rootScope.timeList = $scope.timeList;
                    })
                    var isChoosen;
                    $scope.setFrequency = function(){
                        var modalInstance = $modal.open({
                            templateUrl: 'app/layout/context/getFrequency.tpl.html',
                            windowClass: 'app-modal-window',
                            controller: function($scope,$modalInstance){
                                $scope.timeTypeList = ["Daily","Weekly"];
                                $scope.timeValList = [
                                    "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
                                    "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
                                    "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"
                                    ];
                                $scope.timeHoldList = [
                                    "1","2","3","4","5","6","7","8","9","10","11","12",
                                    "13","14","15","16","17","18","19","20","21","22","23","24"
                                    ];
                                $scope.weeks = [];
                                $scope.weekdays = [];
                                function validateWeekdaysShow(){
                                    if ($scope.timeType == "Weekly") {
                                        $scope.weekdays = [
                                            {name:'Monday'},
                                            {name:'Tuesday'},
                                            {name:'Wednesday'},
                                            {name:'Thursday'},
                                            {name:'Friday'},
                                            {name:'Saturday'},
                                            {name:'Sunday'}
                                        ];
                                    }else{
                                        $scope.weekdays = [];
                                    }
                                }
                                $scope.getStartTime = function(startTime){
                                    $scope.startTime = startTime;
                                }
                                $scope.getTimeType = function(timeType){
                                    $scope.timeType = timeType;
                                    validateWeekdaysShow();
                                }
                                $scope.getHoldTime = function(holdTime){
                                    $scope.holdTime = holdTime;
                                }
                                $scope.getWeekDays = function(weekday){
                                    weekday.choosen = !weekday.choosen;
                                    if(weekday.choosen == true){
                                        $scope.weeks.push(weekday.name);
                                    }else{
                                        for(var i=0;i<$scope.weeks.length;i++){
                                            if($scope.weeks[i] == weekday.name){
                                                $scope.weeks.splice(i,1);
                                            }
                                        }
                                    }
                                }
                                $scope.submitFrequency = function(){
                                    if(!$scope.timeType){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>timeType is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if(!$scope.startTime){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>startTime is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if(!$scope.holdTime){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>holdTime is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if($scope.timeType == "Weekly"){
                                        if ($scope.weeks.length == 0) {
                                            $.smallBox({
                                                title: "Set Frequency Error",
                                                content: "<i class='fa fa-clock-o'></i> <i>weeks is null.</i>",
                                                color: "#C46A69",
                                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                            return
                                        };
                                    }
                                    $scope.tempList = {timeType:$scope.timeType,startTime:$scope.startTime,holdTime:$scope.holdTime,weeks:$scope.weeks};
                                    $rootScope.timeList.push($scope.tempList);
                                    $modalInstance.close();
                                }
                                $scope.cancelFrequency = function(){
                                    $modalInstance.close();
                                }
                            }
                        });
                    }






                    $scope.editFrequency = function(){
                        if ($scope.selectedTimeList.length != 1) {
                            $.smallBox({
                                title: "Edit Frequency Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Please select one.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                            return
                        };
                        $rootScope.choosedTimeList = $scope.selectedTimeList[0];
                        var modalInstance = $modal.open({
                            templateUrl: 'app/layout/context/getFrequency.tpl.html',
                            windowClass: 'app-modal-window',
                            controller: function($scope,$modalInstance){
                                $scope.timeTypeList = ["Daily","Weekly"];
                                $scope.timeValList = [
                                    "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
                                    "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
                                    "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"
                                    ];
                                $scope.timeHoldList = [
                                    "1","2","3","4","5","6","7","8","9","10","11","12",
                                    "13","14","15","16","17","18","19","20","21","22","23","24"
                                    ];
                                $scope.weeks = [];
                                $scope.weekdays = [];
                                $scope.timeType = $rootScope.choosedTimeList.timeType;
                                $scope.startTime = $rootScope.choosedTimeList.startTime;
                                $scope.holdTime = $rootScope.choosedTimeList.holdTime;
                                $scope.weeks = $rootScope.choosedTimeList.weeks;
                                validateWeekdaysShow();
                                function validateWeekdaysShow(){
                                    if ($scope.timeType == "Weekly") {
                                        $scope.weekdays = [
                                            {name:'Monday',checked:false},
                                            {name:'Tuesday',checked:false},
                                            {name:'Wednesday',checked:false},
                                            {name:'Thursday',checked:false},
                                            {name:'Friday',checked:false},
                                            {name:'Saturday',checked:false},
                                            {name:'Sunday',checked:false}
                                        ];
                                        for (var i = 0; i < $scope.weekdays.length; i++) {
                                            for (var j = 0; j < $scope.weeks.length; j++) {
                                                if ($scope.weekdays[i].name == $scope.weeks[j]) {
                                                    $scope.weekdays[i].checked = true;
                                                };
                                            };
                                        };
                                    }else{
                                        $scope.weekdays = [];
                                    }
                                }
                                $scope.checkedWeek = function(weekday){
                                    return true;
                                }
                                $scope.getStartTime = function(startTime){
                                    $scope.startTime = startTime;
                                    $rootScope.choosedTimeList.startTime = startTime;
                                }
                                $scope.getTimeType = function(timeType){
                                    $scope.timeType = timeType;
                                    $rootScope.choosedTimeList.timeType = timeType;
                                    validateWeekdaysShow();
                                }
                                $scope.getHoldTime = function(holdTime){
                                    $scope.holdTime = holdTime;
                                    $rootScope.choosedTimeList.holdTime = holdTime;
                                }
                                $scope.getWeekDays = function(weekday){
                                    weekday.checked = !weekday.checked;
                                    if (weekday.checked) {
                                        $scope.weeks.push(weekday.name);
                                    }else{
                                        for(var i=0;i<$scope.weeks.length;i++){
                                            if($scope.weeks[i] == weekday.name){
                                                $scope.weeks.splice(i,1);
                                            }
                                        }
                                    }
                                }

                                $scope.submitFrequency = function(){
                                    if(!$scope.timeType){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>timeType is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if(!$scope.startTime){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>startTime is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if(!$scope.holdTime){
                                        $.smallBox({
                                            title: "Set Frequency Error",
                                            content: "<i class='fa fa-clock-o'></i> <i>holdTime is null.</i>",
                                            color: "#C46A69",
                                            iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                            timeout: 4000
                                        });
                                        return
                                    }
                                    if($scope.timeType == "Weekly"){
                                        if ($scope.weeks.length == 0) {
                                            $.smallBox({
                                                title: "Set Frequency Error",
                                                content: "<i class='fa fa-clock-o'></i> <i>weeks is null.</i>",
                                                color: "#C46A69",
                                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                            return
                                        };
                                    }
                                    // $scope.tempList = {timeType:$scope.timeType,startTime:$scope.startTime,holdTime:$scope.holdTime,weeks:$scope.weeks};
                                    // $rootScope.timeList.push($scope.tempList);
                                    $modalInstance.close();
                                }
                                $scope.cancelFrequency = function(){
                                    $modalInstance.close();
                                }
                            }
                        });
                    }





                    function validateButtons(){
                        if ($scope.selectedTimeList.length == 1) {
                            $scope.editFrequencyFlag = false;
                        }else{
                            $scope.editFrequencyFlag = true;
                        };
                        if ($scope.selectedTimeList.length >= 1) {
                            $scope.removeFrequencyFlag = false;
                        }else{
                            $scope.removeFrequencyFlag = true;
                        }
                    };

                    $scope.selectTimeList = function(time){
                        var addFlag = true;
                        for (var i = 0; i < $scope.selectedTimeList.length; i++) {
                            if($scope.selectedTimeList[i] == time){
                                addFlag = false;
                                $scope.selectedTimeList.splice(i,1);
                            }
                        };
                        if (addFlag) {
                            $scope.selectedTimeList.push(time);
                        };
                        validateButtons();
                    }

                    $scope.removeFrequency = function(){
                        for (var i = 0; i < $rootScope.timeList.length; i++) {
                            for (var j = 0; j < $scope.selectedTimeList.length; j++) {
                               if ($rootScope.timeList[i] == $scope.selectedTimeList[j]) {
                                    $rootScope.timeList.splice(i,1);
                               }; 
                            };
                        };
                        $scope.selectedTimeList = [];
                        validateButtons();
                    }

                    $scope.setDwm = function(){
                        $scope.timeList = $rootScope.timeList;
                        if ($scope.enable_dwm && $scope.timeList.length == 0) {
                            $.smallBox({
                                title: "Set Dwm Error",
                                content: "<i class='fa fa-clock-o'></i> <i>timeList is null.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                            return
                        };
                        navPolicyService.setDwm($scope,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Set Dwm",
                                    content: "<i class='fa fa-clock-o'></i> <i>Setting Dwm Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Dwm Submit",
                                    content: "<i class='fa fa-clock-o'></i> <i>Setting Dwm Submit</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }



//======================

                }
            });
        }

    });

    module.registerFilter("showWeeks",function(){
        var filterWeeks = function(weeks){
            var weeksCh = [
                {name:'Monday',value:'周一'},
                {name:'Tuesday',value:'周二'},
                {name:'Wednesday',value:'周三'},
                {name:'Thursday',value:'周四'},
                {name:'Friday',value:'周五'},
                {name:'Saturday',value:'周六'},
                {name:'Sunday',value:'周日'}
            ];
            for(var i=0;i<weeks.length;i++){
                for(var j=0;j<weeksCh.length;j++){
                    if(weeks[i] == weeksCh[j].name){
                        weeks[i] = weeksCh[j].value
                    }
                }
            }
            var tempWeeks = weeks.join(",");
            return tempWeeks;
        }
        return filterWeeks;
    });


});
