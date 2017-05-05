define(['modules/storage/module'], function (module) {

    'use strict';

    module.registerController('storageGlusterCtrl', function ($scope, $stateParams, glusterService) {
        //console.log("storageGlusterCtrl",$scope, $stateParams);
        glusterService.setStorageServer($stateParams.storageserverid);
    })

    module.registerController('storageListVolumeCtrl', function ($scope, glusterService, centersService) {
        $scope.volumes = glusterService.volumes;
        glusterService.getAllVolumes();

        $scope.validBricks = glusterService.bricks;
        glusterService.getAllBricks();

        $scope.usedBricks = [];
        $scope.replaceShow = false;
        $scope.currentBrickToReplace = {};
        $scope.centers = centersService.centers;

        centersService.getAllCenters();
        $scope.editBricksMode = false;
        $scope.showBricks = function () {
            $scope.editBricksMode = true;
        }

        $scope.newVolume = {
            bricks : []
        };

        $scope.isValid = function (brick) {
            if (brick.used == true || brick.use_status == "used" || brick.brick_connect_status == "Disconnected") {
                return false ;
            }
            else {
                return true ;
            }
        }

        $scope.addBrick = function (brick) {
            $scope.newVolume.bricks.push(brick);
            brick.used = true;
        }

        $scope.deleteBrick = function ($index) {
            var toDelete = $scope.newVolume.bricks[$index];
            angular.forEach($scope.validBricks, function (item) {
                if (item.id == toDelete.id) {
                    item.used = false;
                }
            });

            $scope.newVolume.bricks.splice($index, 1);
        }

        $scope.deleteVolume = function (volume) {
            $.SmartMessageBox({
                title: "Delete Volume!",
                content: "Are You Sure To Delete Volume?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.deleteVolume(volume, function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Delete Volume Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Delete Volume Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Volume Delete Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Volume Delete Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        glusterService.getAllVolumes();
                        glusterService.getAllBricks();
                     });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Volume Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete Volume Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }              
            });
        }

        $scope.openVolume = function (volume) {
            $.SmartMessageBox({
                title: "Start Volume!",
                content: "Are You Sure To Start Volume?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.openVolume(volume, function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Start Volume Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Start Volume Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Volume Start Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Volume Start Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        glusterService.getAllVolumes();
                     });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Start Volume Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Start Volume Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }              
            });  
        }

        $scope.closeVolume = function (volume) {
            $.SmartMessageBox({
                title: "Stop Volume!",
                content: "Are You Sure To Stop Volume?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.closeVolume(volume, function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Stop Volume Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Stop Volume Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Volume Stop Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Volume Stop Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        glusterService.getAllVolumes();
                     });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Stop Volume Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Stop Volume Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }              
            });
        }

         $scope.rebalanceVolume = function (volume) {
            $.SmartMessageBox({
                title: "Rebalance Volume!",
                content: "Are You Sure To Rebalance Volume?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.rebalanceVolume(volume, function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Rebalance Volume Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Rebalance Volume Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Volume Rebalance Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Volume Rebalance Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        glusterService.getAllVolumes();
                     });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Rebalance Volume Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Rebalance Volume Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }              
            });
        }

        $scope.createNewVolume = function () {
            var brick_id_list = [];
            var volumeToSubmit = {};
            angular.forEach($scope.newVolume.bricks, function (item) {
                console.log(">foreach", item);
                brick_id_list.push(item.id);
            });

            volumeToSubmit.brick_id_list = angular.toJson(brick_id_list);

            angular.extend(volumeToSubmit, $scope.newVolume);
             glusterService.createVolume(volumeToSubmit,function(data){
                $scope.return_data = data;
                if ($scope.return_data.error != null){
                    $.smallBox({
                        title: "Create Volume Error",
                        content: "<i class='fa fa-clock-o'></i> <i>Create Volume Error: </i>" + $scope.return_data.error+ "",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });

                }
                else{
                    $.smallBox({
                        title: "Volume Creation Submit",
                        content: "<i class='fa fa-clock-o'></i> <i>Volume Creation Submit</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
                        // });
            // glusterService.createVolume(volumeToSubmit).then(function (){
            //     $.bigBox({
            //         title: "create volume successed"
            //     });
                glusterService.getAllVolumes();
                glusterService.getAllBricks();  
                $('#AddVolume').modal('hide');
                $scope.newVolume.bricks = [];
                $scope.newVolume.mode = "";
                $scope.newVolume.number = "";
                $scope.newVolume.name = "";
            });
            
            //console.log("--->", volumeToSubmit);
        }

        $scope.closeUnbind = function () {
            $scope.unbindShow = false;
        }

        var editCenter = $scope.editCenter = function (volume, center) {
            console.log("center", center)
            $scope.currentCenter =  angular.copy(center);
            glusterService.getServersByCenter(volume, $scope.currentCenter).then(function (result) {
                $scope.currentCenter.servers = result.data;
                $scope.unbindShow = true;
            });
        }

        $scope.AddCenter = function (volume) {
            $scope.currentVolume =  angular.copy(volume);
            console.log(">add Center:", volume);
            $('#AddCenter').modal();
        }

        $scope.unbind = function (volume, center) {
            // glusterService.unbindCenter(volume, center).then(function () {
            //     $.bigBox({
            //         title: "unbind volume from  center successed"
            //     });
             $.SmartMessageBox({
                title: "Unbind Volume!",
                content: "Are You Sure To Unbind Volume?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.unbindCenter(volume,center,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Unbind Center Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Unbind Center Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Unbind Center Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Unbind Center Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                    glusterService.getAllVolumes();
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Unbind Volume Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Unbind Volume Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });       
        }

        $scope.mountServer = function (server) {
            // glusterService.mountServer(server).then(function (result) {
            //     $.bigBox({
            //         title: "mount volume successed"
            //     });
            //     glusterService.getAllVolumes();
            //    // unbind();
            // });
            $.SmartMessageBox({
                title: "Mount Volume To Server!",
                content: "Are You Sure Mount Volume To Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.mountServer(server,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Mount Volume To Server Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Mount Volume To Server Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Mount Volume To Server",
                                content: "<i class='fa fa-clock-o'></i> <i>Mount Volume To Server Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                    glusterService.getAllVolumes();
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Mount Volume To Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Mount Volume To Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });       
        }

        $scope.unmountServer = function (server) {  
            // glusterService.unmountServer(server).then(function (result) {
            //     $.bigBox({
            //         title: "unmount volume successed"
            //     });
            //     glusterService.getAllVolumes();
            //     //unbind();
            // });
            $.SmartMessageBox({
                title: "Unmount Volume From Server!",
                content: "Are You Sure Unmount Volume From Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.unmountServer(server,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Unmount Volume From Server Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Unmount Volume From Server Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Unmount Volume From Server",
                                content: "<i class='fa fa-clock-o'></i> <i>Unmount Volume From Server Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                    glusterService.getAllVolumes();
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Unmount Volume From Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Unmount Volume From Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });       
        }

        $scope.createNewCenter = function () {
            var volume = $scope.currentVolume
            // glusterService.createCenter(volume, $scope.newCenter).then(function (result) {
            //     $.bigBox({
            //         title: "create center  successed"
            //     });
            glusterService.createCenter(volume,$scope.newCenter,function(data){
                $scope.return_data = data;
                if ($scope.return_data.error != null){
                    $.smallBox({
                        title: "Bind Center Error",
                        content: "<i class='fa fa-clock-o'></i> <i>Bind Center Error: </i>" + $scope.return_data.error+ "",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });

                }
                else{
                    $.smallBox({
                        title: "Bind Center Submit",
                        content: "<i class='fa fa-clock-o'></i> <i>Bind Center Submit</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    
                }
                glusterService.getAllVolumes();
                glusterService.getAllBricks();  
                $('#AddCenter').modal('hide');
                $scope.newCenter = {};
                
            });
        }

        $scope.unused = function (brick, volume_bricks) {
            var found = false;
            angular.forEach(volume_bricks, function (_brick){
                if (_brick.id == brick.id) {
                    found = true;
                }
            });

            return !found;
        }

        $scope.notUsed = function (brick) {
            var found = false;
            angular.forEach($scope.usedBricks, function (item) {
                if (item.id == brick.id) {
                    found = true;
                }
            });

            return !found;
        }
        $scope.closeReplace = function () {
            $scope.replaceShow = false;
        }

        $scope.replaceVolume = function (brick, volume_bricks) {
            $scope.currentBrickToReplace = brick;
            $scope.replaceShow = true;
            var _bricks = angular.copy(volume_bricks);
            _bricks.push(brick);
            $scope.usedBricks =_bricks;

        }

        $scope.AddVolumeBrick = function (volume) {
            $scope.modifiedVolume =  angular.copy(volume);
            console.log(">add Center:", volume);
            $('#AddVolumeBrick').modal();
        }

        $scope.addVolumeBrickFinal = function () {
            var volume = $scope.modifiedVolume;
            var brick_id_list = [];
            var volumeToSubmit = {};
            console.log($scope.newVolume);
            console.log(volume);
            angular.forEach($scope.newVolume.bricks, function (item) {
                console.log(">foreach", item);
                brick_id_list.push(item.id);
            });
            volumeToSubmit.brick_id_list = angular.toJson(brick_id_list);
            volumeToSubmit.volume_id = volume.id;
            // glusterService.addVolumeBrick(volumeToSubmit).then(function () {
            //     $.bigBox({
            //         title: "add volume brick successed" 
            //     });
            //     glusterService.getAllVolumes();
            //     glusterService.getAllBricks();  
            //     $('#AddVolumeBrick').modal('hide');
            // }); 
            glusterService.addVolumeBrick(volumeToSubmit,function(data){
                $scope.return_data = data;
                if ($scope.return_data.error != null){
                    $.smallBox({
                        title: "Add Brick For Volume Error",
                        content: "<i class='fa fa-clock-o'></i> <i>Add Brick For Volume Error: </i>" + $scope.return_data.error+ "",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });

                }
                else{
                    $.smallBox({
                        title: "Add Brick For Volume Submit",
                        content: "<i class='fa fa-clock-o'></i> <i>Add Brick For Volume Submit</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    
                }
                glusterService.getAllVolumes();
                glusterService.getAllBricks();  
                $('#AddVolumeBrick').modal('hide');
            }); 
        }

        $scope.wrapVolume = function (volume, targetBrick) {
            // glusterService.replaceVolume(volume, $scope.currentBrickToReplace, targetBrick).then(function (){
            //     $.bigBox({
            //         title: "volume replace successed"
            //     });
            //     glusterService.getAllVolumes();
            //     glusterService.getAllBricks();  
            // });
            $.SmartMessageBox({
                title: "Replace Volume Brick!",
                content: "Are You Sure To Replace Volume Brick?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.replaceVolume(volume, $scope.currentBrickToReplace, targetBrick,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Replace Volume Brick Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Replace Volume Brick Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Replace Volume Brick Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Replace Volume Brick Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                    glusterService.getAllVolumes();
                    glusterService.getAllBricks();  
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Replace Volume Brick Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Replace Volume Brick Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });       
            
        }
    });

    module.registerController('storageListBricksCtrl', function ($scope, glusterService) {
        $scope.bricks = glusterService.bricks;
        glusterService.getAllBricks();
        $scope.deleteBrick = function (brick) {
            // glusterService.deleteBrick(brick).then(function () {
            //     $.bigBox({
            //         title: "delete Brick successed"
            //     });
            //     glusterService.getAllBricks();
            // });
            $.SmartMessageBox({
                title: "Delete Brick!",
                content: "Are You Sure To Delete Brick?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    glusterService.deleteBrick(brick,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Delete Brick Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Delete Brick Error: </i>" + $scope.return_data.error+ "",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                        else{
                            $.smallBox({
                                title: "Delete Brick Submit",
                                content: "<i class='fa fa-clock-o'></i> <i>Delete Brick Submit</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                    glusterService.getAllBricks();
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Brick Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete Brick Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }
            });       
            
        }

        $scope.createNewBrick = function () {
            glusterService.createBrick($scope.newBrick,function(data){
                $scope.return_data = data;
                if ($scope.return_data.error != null){
                    $.smallBox({
                        title: "Add Brick Error",
                        content: "<i class='fa fa-clock-o'></i> <i>Add Brick Error: </i>" + $scope.return_data.error+ "",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });

                }
                else{
                    $.smallBox({
                        title: "Add Brick Submit",
                        content: "<i class='fa fa-clock-o'></i> <i>Add Brick Submit</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    
                }
                glusterService.getAllBricks();
                $('#AddBrick').modal('hide');
                $scope.newBrick = {};
            });
        }    
    });
});
