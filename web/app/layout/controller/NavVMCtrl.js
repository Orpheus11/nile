define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavVMCtrl', function ($scope,$modal,$window,$log,navVMService,navImageService,navNetworkService,$rootScope) {

        $scope.CreateVM = function (server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/createVM.tpl.html',
                windowClass: 'app-modal-window',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.vm_images=[];
                    $scope.selected_vlan = 0;
                    $scope.vm_cpu = 1;
                    $scope.vm_memory = 1024;
                    $scope.vlans = navNetworkService.vlans;
                    $scope.ovsBrs = navNetworkService.ovsBrs;
                    $scope.ovsbr = "br0";
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }

                    $scope.SetSelectedImage = function(image){
                        $('span#selectImage-error').remove();
                        $('input.selectImage').remove();
                        $scope.selected_image = image;
                    }

                    $scope.SetSelectedISO = function(iso){
                        $('span#selectIso-error').remove();
                        $('input.selectIso').remove();
                        $scope.selected_image = iso;
                    }

                    $scope.SetSelectedVlan = function(vlan){
                        $scope.selected_vlan = vlan;
                    }

                    $scope.SetSelectedStorage = function(storage){
                        $('span#selectStorage-error').remove();
                        $('input.selectStorage').remove();
                        $scope.selected_storage = storage;
                    }

                    $scope.SetVMTypeImage = function(){
                        $('input.vmType').remove();
                        $scope.vm_type = "image";
                    }

                    $scope.SetVMTypeISO = function(){
                        $('input.vmType').remove();
                        $scope.vm_type = "iso";
                    }

                    $scope.SetVMCPU = function(count){
                        $scope.vm_cpu = count;
                    }
                    $scope.SetVMMemory = function(size){
                        $scope.vm_memory = size;
                    }
                    navImageService.getImageServers(function(data){
                        $scope.image_servers = data;
                    });

                    navNetworkService.getVlansByServerId(server_id);
                    navNetworkService.getOvsBrsByServerId(server_id);

                    $scope.GetImageServerDetailImage = function(image_server_id){
                        navImageService.getImageServerDetailImage(image_server_id,function(data){
                            $scope.vm_images = data;
                            $scope.selected_imageserver_id = image_server_id;
                        });
                    }

                    $scope.GetImageServerDetailISO = function(image_server_id){
                        navImageService.getImageServerDetailISO(image_server_id,function(data){
                            $scope.vm_isos = data;
                            $scope.selected_imageserver_id = image_server_id;
                        });
                    }


                    navVMService.listServerStorage(server_id, function (data) {
                        $scope.server_storage = data;
                        var local_storage = { "volume_name":"LocalStorage", "volume_id":"-1",
                                                "volume_totalspace":"Local","volume_usedspace":"Local",
                                                "mount_dir":"/opt/vms","status":"mount success"}
                        $scope.server_storage.unshift(local_storage);
                        //console.log($scope.server_storage);
                    });
                    $scope.selectBr = function(ovsbr){
                        $('span#selectBr-error').remove();
                        $('input.selectBr').remove();
                        $scope.ovsbr = ovsbr;
                        //alert($scope.ovsbr);
                    }


                    $scope.createVM=function(){
                        navVMService.createVM($scope.server_id,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Create VM Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Create VM Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "VM Creation Submit",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Creation Submit</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }
                    $scope.CreateVMCompleteCallback = function(wizardData){
                        wizardData.ovsbr = $scope.ovsbr;
                        $scope.closeModal = function(){
                            $modalInstance.close();
                        }
                        navVMService.createVM(wizardData,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Create VM Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Create Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Create VM Task Started</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    };
                }
            });
            modalInstance.result.then(function () {
                //$scope.UpdateTree();
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateTree();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.DeleteVM = function (vm_id) {
            $.SmartMessageBox({
                title: "Delete VM!",
                content: "Are You Sure To Delete VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.deleteVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been Deleted.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };

        $scope.ShutdownVM = function (vm_id) {
            $.SmartMessageBox({
                title: "Shutdown VM!",
                content: "Are You Sure To Shutdown VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.shutdownVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Shutdown Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not shutdown.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM ShutDown",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been shutdown.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Shutdown VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Shutdown VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };
        $scope.ForceShutdownVM = function (vm_id) {
            $.SmartMessageBox({
                title: "ForceShutdown VM!",
                content: "Are You Sure To ForceShutdown VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.forceShutdownVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "ForceShutdown Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not ForceShutdown.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM ForceShutdown",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been ForceShutdown.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "ForceShutdown VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>ForceShutdown VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };
        $scope.StartVM = function (vm_id) {
            $.SmartMessageBox({
                title: "Start VM!",
                content: "Are You Sure To Start VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.startVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Start Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not Started.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM Started",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been Started.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Start VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Start VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };

        $scope.SuspendVM = function (vm_id) {
            $.SmartMessageBox({
                title: "Suspend VM!",
                content: "Are You Sure To Start VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.suspendVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Start Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not Suspended.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM Suspended",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been Suspended.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Suspend VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Suspend VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };

        $scope.ResumeVM = function (vm_id) {
            $.SmartMessageBox({
                title: "Resume VM!",
                content: "Are You Sure To Resume VM?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navVMService.resumeVM(vm_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Resume Error",
                                content: "<i class='fa fa-clock-o'></i> <i>VM Not Resumed.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "VM Resumed",
                                content: "<i class='fa fa-clock-o'></i> <i>VM has been Resumed.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Resume VM Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Resume VM Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });
        };
        $scope.ConsoleVM = function (vm_id) {
            navVMService.getVMConsole(vm_id,function(data){
                $scope.console_ip = data.ip;
                $scope.consoleserver_port = data.port;
                $scope.console_vm_name = data.name;
                console.log(data);
                $window.open("spice/index.html?host=" + data.ip + "&port=" + data.port+"&name="+data.name);
            });
        };

        $scope.MigrateVM = function (vm_id,vm_name,vm_des,servers) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/migrateVM.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.vm_id = vm_id;
                    $rootScope.servers = servers;
                    $scope.vm_name=vm_name;
                    $scope.vm_des = vm_des;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.migrateVM=function(){
                        navVMService.migrateVM($scope.vm_id,$scope.server_id,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Migrate Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Migrate VM Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Migrate Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Migrated</i>",
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
        };

        <!-- Snapshot -->
        $scope.SnapshotVM = function(vm_id){
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/snapshotVM.tpl.html',
                controller: function($scope,$rootScope,$modalInstance,$interval){
                    $scope.vm_snapshot_id = "";
                    $scope.vm_id = vm_id;
                    $scope.preview_snapshot_id = "";
                    $scope.preview_vm_position = false;
                    $scope.vm_position = true;
                    var choosenSnap = "";
                    function loadSnapshotList(){
                        navVMService.getSnapshotList($scope.vm_id,function(data){
                            $scope.snapshot_list = data;
                            for(var o in data){
                                if(o.vm_position == true){
                                    $scope.preview_snapshot_id = o.vm_snapshot_id;
                                }
                            }
                        });
                    }
                    loadSnapshotList();
                    $rootScope.autoUpdate = false;
                    var updateInterval;
                    function snapshotAble(){
                        if(choosenSnap != ""){
                            $('button.snapshotBtn').each(function(){
                                if($(this).attr('disabled')){
                                    $(this).removeAttr('disabled');
                                }
                            });
                        }else{
                            $('button.btnControl').each(function(){
                                if($(this).attr('disabled')){
                                    $(this).removeAttr('disabled');
                                }
                            });
                        }
                    }
                    function disableAllSnapshot(){
                        $('button.snapshotBtn').each(function(){
                            if($(this).attr('disabled')){
                                return;
                            }else{
                                $(this).attr('disabled','true');
                            }
                        });
                    }
                    function judgeVMStatus(){
                        navVMService.getVMStatus($scope.vm_id,function(data){
                            $scope.isOperateVM = data.vm_status;
                            if($scope.isOperateVM != "backingup"&&$scope.isOperateVM != "backup_restoring"&&$scope.isOperateVM != "snapshoting"&&
                                $scope.isOperateVM != "snapshot_restoring"&&$scope.isOperateVM != "delete_backup"&&$scope.isOperateVM != "delete_snapshot"){
                                $rootScope.autoUpdate = false;
                            }
                        });
                    }
                    $scope.addSnapshot = function(){
                        var modalInstance = $modal.open({
                            templateUrl: 'app/layout/context/addSnapshot.tpl.html',
                            controller: function($scope,$modalInstance){
                                $scope.submitSnapshot = function(snapshot_filename,snapshotDes){
                                    $scope.snapshot_filename = snapshot_filename;
                                    $scope.snapshot_describle = snapshotDes;
                                    $scope.vm_id = vm_id;
                                    $rootScope.autoUpdate = true;
                                    navVMService.addSnapshotList($scope.vm_id,$scope.snapshot_filename,$scope.snapshot_describle,function(data){
                                        $scope.return_data = data;
                                        if ($scope.return_data.error != null){
                                            $.smallBox({
                                                title: "AddSnapshot Error",
                                                content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error.</i>" + $scope.return_data.error+ "",
                                                color: "#C46A69",
                                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                        }
                                        else{
                                            $.smallBox({
                                                title: "AddSnapshot Succeed",
                                                content: "<i class='fa fa-clock-o'></i> <i>VM Snapshoted</i>",
                                                color: "#659265",
                                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                            choosenSnap = "";
                                        }
                                        $modalInstance.close();
                                    });
                                }
                                $scope.cancelAdd = function(){
                                    $modalInstance.close();
                                }
                            }
                        });
                    }

                    $scope.getSnapshotId = function(snapshotId){
                        $scope.vm_snapshot_id = snapshotId;
                        choosenSnap = snapshotId;
                        if($rootScope.autoUpdate == false){
                            snapshotAble();
                        }
                    }
                    $scope.restoreSnapshot = function(){
                        $rootScope.autoUpdate = true;
                        if($scope.preview_snapshot_id != ""){
                            navVMService.restoreSnapshotList($scope.preview_snapshot_id,$scope.preview_vm_position,function(data){
                                $scope.preview_return_data = data;
                            });
                        }
                        navVMService.restoreSnapshotList($scope.vm_snapshot_id,$scope.vm_position,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "RestoreSnapshot Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error.</i>" + $scope.return_data.error+ "",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                            }
                            else{
                                $.smallBox({
                                    title: "RestoreSnapshot Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Snapshot Restored</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                choosenSnap = "";
                            }
                        });
                    }

                    $scope.deleteSnapshot = function(){
                        navVMService.deleteSnapshotList($scope.vm_snapshot_id,function(data){
                            $rootScope.autoUpdate = true;
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "DeleteSnapshot Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error.</i>" + $scope.return_data.error+ "",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                            }
                            else{
                                $.smallBox({
                                    title: "DeleteSnapshot Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Snapshot Deleted</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                choosenSnap = "";
                            }
                        });
                    }
                    var watch = $scope.$watch('autoUpdate', function(autoUpdate){
                        if(autoUpdate){
                            updateInterval = $interval(function(){
                                judgeVMStatus();
                                disableAllSnapshot();
                            }, 500)
                        } else {
                            snapshotAble();
                            loadSnapshotList();
                            $interval.cancel(updateInterval);
                        }
                    });
                    $modalInstance.close();
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
        <!-- end Snapshot -->

        <!-- backup -->
        $scope.BackupVM = function(vm_id){
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/backupVM.tpl.html',
                controller: function($scope,$rootScope,$modalInstance,$interval){
                    $scope.vm_backup_id = "";
                    $scope.vm_id = vm_id;
                    $scope.preview_backup_id = "";
                    $scope.preview_vm_position = false;
                    $scope.vm_position = true;
                    var choosenbackup = "";
                    function getBackupList(){
                        navVMService.getBackupList($scope.vm_id,function(data){
                            $scope.backupVM_list = data;
                            for(var o in data){
                                if(o.vm_position == true){
                                    $scope.preview_backup_id = o.vm_backup_id;
                                }
                            }
                        });
                    }
                    getBackupList();
                    $rootScope.autoUpdate = false;
                    var updateInterval;
                    function backupAble(){
                        if(choosenbackup != ""){
                            $('button.backupBtn').each(function(){
                                if($(this).attr('disabled')){
                                    $(this).removeAttr('disabled');
                                }
                            });
                        }else{
                            $('button.backupControl').each(function(){
                                if($(this).attr('disabled')){
                                    $(this).removeAttr('disabled');
                                }
                            });
                        }
                    }
                    function disableAllbackup(){
                        $('button.backupBtn').each(function(){
                            if($(this).attr('disabled')){
                                return;
                            }else{
                                $(this).attr('disabled','true');
                            }
                        });
                    }
                    function judgeVMStatus(){
                        navVMService.getVMStatus($scope.vm_id,function(data){
                            $scope.isOperateVM = data.vm_status;
                            if($scope.isOperateVM != "backingup"&&$scope.isOperateVM != "backup_restoring"&&$scope.isOperateVM != "snapshoting"&&
                                $scope.isOperateVM != "snapshot_restoring"&&$scope.isOperateVM != "delete_backup"&&$scope.isOperateVM != "delete_snapshot"){
                                $rootScope.autoUpdate = false;
                            }
                        });
                    }
                    $scope.addBackup = function(){
                        var modaInstance = $modal.open({
                            templateUrl: 'app/layout/context/addBackup.tpl.html',
                            controller: function($scope,$modalInstance){
                                $scope.backup_type = "";
                                $scope.backupTypeList = [{name:"全量备份",value:"full backup"},{name:"增量备份",value:"incremental backup"}];
                                $scope.getBackupType = function(backupType){
                                    $scope.backup_type =backupType.value;
                                }
                                $scope.submitBackup = function(backup_filename,backupDes){
                                    $scope.backup_filename = backup_filename;
                                    $scope.backupDes = backupDes;
                                    $scope.vm_id = vm_id;
                                    $rootScope.autoUpdate = true;
                                    navVMService.addBackupList($scope.vm_id,$scope.backup_type,$scope.backup_filename,$scope.backupDes,function(data){
                                        $scope.return_data = data;
                                        if ($scope.return_data.error != null){
                                            $.smallBox({
                                                title: "AddSnapshot Error",
                                                content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error.</i>" + $scope.return_data.error+ "",
                                                color: "#C46A69",
                                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                        }
                                        else{
                                            $.smallBox({
                                                title: "AddSnapshot Succeed",
                                                content: "<i class='fa fa-clock-o'></i> <i>VM Snapshoted</i>",
                                                color: "#659265",
                                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                                timeout: 4000
                                            });
                                            choosenbackup = "";
                                            $modalInstance.close();
                                        }
                                    });
                                }
                                $scope.cancelAdd = function(){
                                    $modalInstance.close();
                                }
                            }
                        });
                    }

                    $scope.getBackupVMId = function(backupId){
                        $scope.vm_backup_id = backupId;
                        choosenbackup = backupId;
                        if($rootScope.autoUpdate == false){
                            backupAble();
                        }
                    }
                    $scope.restoreBackup = function(){
                        $rootScope.autoUpdate = true;
                        if($scope.preview_backup_id != ""){
                            navVMService.restoreBackupList($scope.preview_backup_id,$scope.preview_vm_position,function(data){
                               $scope.preview_return_data = data;
                            });
                        }
                        navVMService.restoreBackupList($scope.vm_backup_id,$scope.vm_position,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "RestoreSnapshot Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error.</i>" + $scope.return_data.error+ "",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                            }
                            else{
                                $.smallBox({
                                    title: "RestoreSnapshot Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Snapshot Restored</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                choosenbackup = "";
                            }
                        });
                    }

                    $scope.deleteBackup = function(){
                        $rootScope.autoUpdate = true;
                        navVMService.deleteBackupList($scope.vm_backup_id,function(data){
                            $rootScope.autoUpdate = true;
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "DeleteSnapshot Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Snapshot VM Error." + $scope.return_data.error+ "</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                            }
                            else{
                                $.smallBox({
                                    title: "DeleteSnapshot Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM Snapshot Deleted</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                choosenbackup = "";
                            }
                        });
                    }
                    var watch = $scope.$watch('autoUpdate', function(autoUpdate){
                        if(autoUpdate){
                            updateInterval = $interval(function(){
                                judgeVMStatus();
                                disableAllbackup();
                            }, 500)
                        } else {
                            backupAble();
                            getBackupList();
                            $interval.cancel(updateInterval);
                        }
                    });
                    $modalInstance.close();
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
        <!-- end backup -->

        $scope.EditVM = function(vm_id,entity){
            if(entity.status == "shutdown"){
                var modalInstance = $modal.open({
                    templateUrl: 'app/layout/context/editVM.tpl.html',
                    controller: function($scope,$modalInstance){
                        $scope.vm_id = vm_id;
                        navVMService.listVMDetail($scope.vm_id,function(data){
                            $scope.vmDetail = data;
                        });
                        $scope.editVM = function(){
                            $scope.vm_name = $scope.vmDetail.vm_name;
                            $scope.description = $scope.vmDetail.description;
                            $scope.cpu_num = $scope.vmDetail.cpu_num;
                            $scope.memory = $scope.vmDetail.memory;
                            navVMService.editVM($scope.vm_id,$scope.cpu_num,$scope.description,$scope.memory,$scope.vm_name,function(data){
                                $scope.return_data = data;
                                console.log($scope.return_data);
                                if ($scope.return_data.error != null){
                                    $.smallBox({
                                        title: "EditVM Error",
                                        content: "<i class='fa fa-clock-o'></i> <i>Edit VM Error.</i>",
                                        color: "#C46A69",
                                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                        timeout: 4000
                                    });
                                }
                                else{
                                    $.smallBox({
                                        title: "EditVM Succeed",
                                        content: "<i class='fa fa-clock-o'></i> <i>VM Edited</i>",
                                        color: "#659265",
                                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                        timeout: 4000
                                    });
                                    $modalInstance.close();
                                }
                            });
                        }
                        $scope.closeModal = function(){
                            $modalInstance.close();
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $log.info('Modal closed at: ' + new Date());
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }else{
                var modalInstance = $modal.open({
                    templateUrl: 'app/layout/context/editVMView.tpl.html',
                    controller: function($scope,$modalInstance){
                        $scope.vm_id = vm_id;
                        navVMService.listVMDetail($scope.vm_id,function(data){
                            $scope.vmDetail = data;
                        });
                        $scope.closeModal = function(){
                            $modalInstance.close();
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $log.info('Modal closed at: ' + new Date());
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        }


        $scope.TemplateVM = function (vm_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/templateVM.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.vm_id = vm_id;
                    $scope.template_name = "";
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.templateVM=function(){
                        navVMService.templateVM($scope.vm_id,$scope.template_name,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "VM To Template Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM To Template Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "VM To Template Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>VM To Template Succeed </i>",
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
        };



    });
});
