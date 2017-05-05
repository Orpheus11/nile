define(['modules/privilege/module'], function (module) {

    'use strict';

    module.registerController('privilegeRolesCtrl', function ($scope, rolesService, ngDialog,$interval) {
        console.log(">>> privilegeRolesCtrl called ");
        $scope.roles = rolesService.roles;
        $scope.entities = rolesService.entities;
        $scope.currentRole_id = 0;
        // $scope.newRole = {};
        $scope.currentRole = {};
        rolesService.listRoles();
        rolesService.listEntities();
        $scope.roleOper = "Create Role";
        $scope.showCreateRole = function () {
            $scope.roleOper = "Create Role";
            // $scope.newRole = {};
            $scope.currentRole = {};
            angular.forEach($scope.entitiesTreeNodes, function (entityNode) {
                entityNode.state.selected = false;
                entityNode.state = "closed";
            });
            $scope.treeConfig.version++;
        }

        $scope.showEditRole = function (role) {
            $scope.roleOper = "Edit Role";
            rolesService.setCurrentRole(role);
            $scope.currentRole = role;
            rolesService.getEntitiesByRole({Id:role.Id}).then(function (result) {
                angular.forEach($scope.entitiesTreeNodes, function (entityNode) {
                    entityNode.state.selected = false;
                    angular.forEach(result.data.entities, function (entity) {
                        if (entity.Entity_id == entityNode.id) {
                            entityNode.state.selected = true;
                        };
                    });
                });
                $scope.treeConfig.version++;
            });
        }

        $scope.createFormSubmit = function (newRole) {
            rolesService.createRole(newRole).then(function (result) {
                rolesService.listRoles();
                console.log("result.data.role:"+result.data.role)
                addEntitiesToRole(result.data.role.Id);
                $('#OperRole').modal('hide');
            });
        }

        $scope.editFormSubmit = function (currentRole) {
            rolesService.updateRole(currentRole).then(function () {
                rolesService.listRoles();
                addEntitiesToRole(currentRole.Id);
                $('#OperRole').modal('hide');
            });
        }

        $scope.deleteRole = function (role) {
            rolesService.deleteRole(role).then(rolesService.listRoles);
        }

//=====tree==========================
        $scope.selectRole = function (currentRole_id) {
            $scope.currentRole_id = currentRole_id;
            rolesService.getEntitiesByRole({Id:currentRole_id}).then(function (result) {
                angular.forEach($scope.entitiesTreeNodes, function (entityNode) {
                    entityNode.state.selected = false;
                    angular.forEach(result.data.entities, function (entity) {
                        if (entity.Entity_id == entityNode.id) {
                            entityNode.state.selected = true;
                        };
                    });
                });
                $scope.treeConfig.version++;
            });
        }

        var addEntitiesToRole = function(currentRole_id) {
            var selectEntityIds = [];
            var selectNodes = document.getElementsByClassName("jstree-anchor jstree-clicked");
            for (var i = 0; i < selectNodes.length; i++) {
                var entity_id = selectNodes[i].id;
                entity_id = entity_id.split("_anchor")[0];
                selectEntityIds.push(entity_id);
            };
            rolesService.addEntitiesToRole(currentRole_id, selectEntityIds).then(function () {
                rolesService.listRoles();
                $.smallBox({
                    title: "Submit Success",
                    content: "<i class='fa fa-clock-o'></i> <i>Submit Role Entity Success.</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
            });
        }

        rolesService.listEntitiesTreeNodes();
        $scope.entitiesTreeNodes = [];
        $scope.autoUpdate = true;
        var updateInterval;
        $scope.$watch('autoUpdate', function(autoUpdate){
            if(autoUpdate){
                updateInterval = $interval(function(){
                    if (rolesService.entitiesTreeNodes.length > 0) {
                        $scope.entitiesTreeNodes = rolesService.entitiesTreeNodes;
                        $interval.cancel(updateInterval);
                    };
                }, 500)
            } else {
                $interval.cancel(updateInterval);
            }
        });
        $scope.$on("$destroy",function( event ) {
                $interval.cancel(updateInterval);
            }
        );
        // $scope.entitiesTreeNodes = rolesService.entitiesTreeNodes;
        // rolesService.listEntitiesTreeNodes();
        $scope.treeConfig = {
            core : {
                multiple : true,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true,
            },
            types : {
                default : {
                    icon : 'glyphicon glyphicon-flash'
                },
                center : {
                    icon : 'fa fa-lg fa-fw fa-cubes'
                },
                server : {
                    icon : 'fa fa-lg fa-fw fa-cube'
                },
                vm : {
                    icon : 'fa fa-lg fa-fw fa-desktop'
                },
                img : {
                    icon : 'fa fa-lg fa-fw fa-inbox'
                },
                network : {
                    icon : 'fa fa-lg fa-fw fa-sitemap'
                },
                storage : {
                    icon : 'fa fa-lg fa-fw fa-database'
                },
                console : {
                    icon : 'fa fa-lg fa-fw fa-eye'
                }
            },
            version : 1,
            plugins : ['types','checkbox']
        };

//=========tree end=================

//======分页=======

        $scope.showEntities = function(){
            $scope.range = [];
            $scope.preShow = false;
            $scope.endShow = false;
            $scope.itemsPerPage = 10;
            $scope.currentPage = 0;
            $scope.pageCount = Math.ceil($scope.entities.length/$scope.itemsPerPage)-1;
            $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
            $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
            if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.entities.length){
                $scope.toCount = $scope.entities.length;
            }

            $scope.prevPage = function() { 
                if ($scope.currentPage > 0) {
                    $scope.currentPage--; 
                }
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.entities.length){
                    $scope.toCount = $scope.entities.length;
                }
                rangeFn($scope.currentPage);
            };


            $scope.prevPageDisabled = function() {
                return $scope.currentPage === 0 ? "paginate_button previous disabled" : "paginate_button previous";
            };

            function rangeFn(current) {
                var pageList = [];
                if ($scope.pageCount > 10) {
                    if (current < 5) {
                        $scope.range = [0,1,2,3,4,5];
                        $scope.preShow = false;
                        $scope.endShow = true;
                    }
                    if(current === 5){
                        $scope.range = [4,5,6];
                        $scope.preShow = true;
                        $scope.endShow = true;
                    }
                    if (current > 5){
                        if ((current+4) < $scope.pageCount){
                            $scope.range = [current-1,current,current+1];
                            $scope.preShow = true;
                            $scope.endShow = true;
                        }
                        if ((current+4) === $scope.pageCount) {
                            $scope.range = [current-1,current,current+1];
                            $scope.preShow = true;
                            $scope.endShow = true;
                        };
                        if((current+4) > $scope.pageCount) {
                            $scope.range = [$scope.pageCount-4,$scope.pageCount-3,$scope.pageCount-2,$scope.pageCount-1,$scope.pageCount];
                            $scope.preShow = true;
                            $scope.endShow = false;
                        }
                    }
                }else{
                    for (var i = 0; i <= $scope.pageCount; i++) {
                        $scope.range[i] = i;
                        $scope.preShow = false;
                        $scope.endShow = false;
                    };
                }
            }
            rangeFn($scope.currentPage);

            $scope.nextPage = function() {
                if ($scope.currentPage < $scope.pageCount) {
                    $scope.currentPage++; 
                }
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.entities.length){
                    $scope.toCount = $scope.entities.length;
                }
                rangeFn($scope.currentPage);
            };

            $scope.setPage = function(n) {
                $scope.currentPage = n;
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.entities.length){
                    $scope.toCount = $scope.entities.length;
                }
                rangeFn(n);
            };

            $scope.nextPageDisabled = function() {
                return $scope.currentPage === $scope.pageCount ? "paginate_button next disabled" : "paginate_button next";
            }  
        };





//======分页 end============



    });

//     module.registerController('roleCreateController', function ($scope, rolesService, ngDialog) {
//         $scope.newRole = {};
//         $scope.selectRole = function (currentRole_id) {
//             $scope.currentRole_id = currentRole_id;
//             rolesService.getEntitiesByRole({Id:currentRole_id}).then(function (result) {
//                 angular.forEach($scope.entitiesTreeNodes, function (entityNode) {
//                     entityNode.state.selected = false;
//                     angular.forEach(result.data.entities, function (entity) {
//                         if (entity.Entity_id == entityNode.id) {
//                             entityNode.state.selected = true;
//                         };
//                     });
//                 });
//                 $scope.treeConfig.version++;
//             });
//         }

//         $scope.addEntitiesToRole = function() {
//             if ($scope.currentRole_id == 0 ) {
//                 $.smallBox({
//                     title: "Submit Error",
//                     content: "<i class='fa fa-clock-o'></i> <i>Role is not selected.</i>",
//                     color: "#C46A69",
//                     iconSmall: "fa fa-times fa-2x fadeInRight animated",
//                     timeout: 4000
//                 });
//                 return
//             };
//             var selectEntityIds = [];
//             var selectNodes = document.getElementsByClassName("jstree-anchor jstree-clicked");
//             for (var i = 0; i < selectNodes.length; i++) {
//                 var entity_id = selectNodes[i].id;
//                 entity_id = entity_id.split("_anchor")[0];
//                 selectEntityIds.push(entity_id);
//             };
//             rolesService.addEntitiesToRole($scope.currentRole_id, selectEntityIds).then(function () {
//                 rolesService.listRoles();
//                 $.smallBox({
//                     title: "Submit Success",
//                     content: "<i class='fa fa-clock-o'></i> <i>Submit Role Entity Success.</i>",
//                     color: "#659265",
//                     iconSmall: "fa fa-check fa-2x fadeInRight animated",
//                     timeout: 4000
//                 });
//             });
//         }
//         $scope.entitiesTreeNodes = rolesService.entitiesTreeNodes;
//         rolesService.listEntitiesTreeNodes();
//         $scope.treeConfig = {
//             core : {
//                 multiple : true,
//                 animation: true,
//                 error : function(error) {
//                     $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
//                 },
//                 check_callback : true,
//                 worker : true
//             },
//             types : {
//                 default : {
//                     icon : 'glyphicon glyphicon-flash'
//                 },
//                 center : {
//                     icon : 'fa fa-lg fa-fw fa-cubes'
//                 },
//                 server : {
//                     icon : 'fa fa-lg fa-fw fa-cube'
//                 },
//                 vm : {
//                     icon : 'a fa-lg fa-fw fa-desktop'
//                 },
//                 img : {
//                     icon : 'fa fa-lg fa-fw fa-inbox'
//                 },
//                 network : {
//                     icon : 'fa fa-lg fa-fw fa-sitemap'
//                 },
//                 storage : {
//                     icon : 'fa fa-lg fa-fw fa-database'
//                 },
//                 console : {
//                     icon : 'fa fa-lg fa-fw fa-eye'
//                 }
//             },
//             version : 1,
//             plugins : ['types','checkbox']
//         };

//         $scope.formSubmit = function () {
//             rolesService.createRole($scope.newRole).then(function () {
//                 rolesService.listRoles();
//                 ngDialog.closeAll();
//             });
//         }
//     });

//     module.registerController('roleEditController', function ($scope, rolesService, ngDialog) {
//         $scope.currentRole = rolesService.currentRole;

//         $scope.formSubmit = function () {
//             rolesService.updateRole($scope.currentRole).then(function () {
//                 rolesService.listRoles();
//                 ngDialog.closeAll();
//             });
//         }
//     });

});
