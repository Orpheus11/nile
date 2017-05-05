define(['modules/privilege/module'], function (module) {

    'use strict';

    module.registerController('privilegeUsersCtrl', function ($scope, usersService,rolesService, ngDialog) {

        $scope.deps = usersService.deps;
        $scope.users = usersService.users;
        $scope.userTypes = usersService.userTypes;
        $scope.groups = usersService.groups;
        $scope.currentDep = usersService.currentDep;
        $scope.currentUser = usersService.currentUser;
        $scope.currentGroup = usersService.currentGroup;
        $scope.loginUser = usersService.loginUser;
        $scope.loginDep = usersService.loginDep;
        $scope.roles = rolesService.roles;
        usersService.getLoginUser();
        usersService.getLoginDep();
        usersService.listUserTypes();
        rolesService.listRoles();
        function listDeps () {
            usersService.listDeps();
        }
        function listUsers() {
            usersService.listUsers();
        }
        function listGroups() {
            usersService.listGroups();
        }
        
        //init:
        listDeps();
        listUsers();
        listGroups();

        $scope.deleteDep = function (dep) {
            console.log("deleteDep call");
            usersService.deleteDep(dep).then(listDeps);
        }

        $scope.editDep = function (dep) {
            usersService.setCurrentDep(dep);
            ngDialog.open({
                template: 'app/modules/privilege/views/deps_edit.html',
                controller: 'depEditController'
            });
        }

        $scope.deleteUser = function (user) {
            usersService.deleteUser(user).then(listUsers);
        }

        $scope.editUser = function (user) {
            usersService.setCurrentUser(user);

            ngDialog.open({
                template: 'app/modules/privilege/views/users_edit.html',
                controller: 'userEditController'
            });
        }

        $scope.deleteGroup = function (group) {
            usersService.deleteGroup(group).then(listGroups);
        }

        $scope.editGroup = function (group) {
            usersService.setCurrentGroup(group);

            ngDialog.open({
                template: 'app/modules/privilege/views/groups_create.html',
                controller: 'groupEditController'
            });
        }

    });



    module.registerController('depCreateController', function ($scope, usersService, ngDialog) {
        $scope.newDep = {
        };
        $scope.deps = usersService.deps;
        usersService.listDeps();
        $scope.formSubmit = function () {
            usersService.createDep($scope.newDep).then(function () {
                usersService.listDeps();
                ngDialog.closeAll();
            });
        }
    });

    module.registerController('userCreateController', function ($scope, usersService, ngDialog) {
        $scope.newUser = {

        };
        $scope.userTypes = usersService.userTypes;
        $scope.deps = usersService.deps;
        $scope.formSubmit = function () {
            usersService.createUser($scope.newUser).then(function () {
                usersService.listUsers();
                ngDialog.closeAll();
            });
        }
    });

    module.registerController('groupsCreateController', function ($scope, usersService,rolesService, ngDialog) {
        $scope.newGroup = {
            users : []
        };
        $scope.users = usersService.users;
        $scope.roles = rolesService.roles;
        rolesService.listRoles();
        $scope.addToGroup = function (user) {
            $scope.newGroup.users.push(user);
            user.used = true;
        }

        $scope.removeFromGroup = function ($index) {
            var toDelete = $scope.newGroup.users[$index];
            angular.forEach($scope.users, function (item) {
                if (item.Id == toDelete.Id) {
                    item.used = false;
                }
            });

            $scope.newGroup.users.splice($index, 1);
        }

        $scope.formSubmit = function () {
            usersService.createGroup($scope.newGroup).then(function () {
                usersService.listGroups();
                ngDialog.closeAll();
            });
        }
    });

    module.registerController('depEditController', function ($scope, usersService, ngDialog) {
        $scope.newDep = usersService.currentDep;

        $scope.formSubmit = function () {
            usersService.updateDep($scope.newDep).then(function () {
                usersService.listDeps();
                ngDialog.closeAll();
            });
        }
    });



    module.registerController('userEditController', function ($scope, usersService, ngDialog) {
        $scope.newUser = usersService.currentUser;
        
        $scope.userTypes = usersService.userTypes;
        $scope.deps = usersService.deps;
        $scope.formSubmit = function () {
            usersService.updateUser($scope.newUser).then(function () {
                usersService.listUsers();
                ngDialog.closeAll();
            });
        }
    });

    module.registerController('groupEditController', function ($scope, usersService,rolesService, ngDialog) {
        $scope.newGroup = usersService.currentGroup;
        $scope.oldGroup = angular.copy(usersService.currentGroup);
        $scope.newGroup.users = [];
        $scope.users = usersService.users;
        $scope.roles = rolesService.roles;

        usersService.getUsersOfGroup($scope.newGroup).then(function (result) {
            $scope.newGroup.users = result.data.users || [];
            $scope.oldGroup.users = angular.copy($scope.newGroup.users);
            for (var i = 0; i < $scope.users.length; i++) {
                $scope.users[i].used = false;
                for (var j = 0; j < $scope.newGroup.users.length; j++) {
                    if ($scope.newGroup.users[j].Id == $scope.users[i].Id) {
                        $scope.users[i].used = true;
                    };
                };
            };
        });
        //$scope.newGroup.users = $scope.newGroup.users || [];

        // rolesService.listRoles();
   

        $scope.addToGroup = function (user) {

            $scope.newGroup.users.push(user);
            user.used = true;
        }

        $scope.removeFromGroup = function ($index) {
            var toDelete = $scope.newGroup.users[$index];
            angular.forEach($scope.users, function (item) {
                if (item.Id == toDelete.Id) {
                    item.used = false;
                }
            });

            $scope.newGroup.users.splice($index, 1);
        }

        $scope.formSubmit = function () {
            usersService.updateGroup($scope.oldGroup, $scope.newGroup).then(function () {
                usersService.listGroups();
                ngDialog.closeAll();
            });
        }
    });



});
