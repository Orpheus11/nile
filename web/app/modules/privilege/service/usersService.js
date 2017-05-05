define(['app',
    'appConfig'], function(app) {
    "use strict";


    return app.factory('usersService', function ($http, $log, $q, server) {
        var usersService = {};


        //department
        var deps = [];
        var currentDep = {};
        var loginUser = {};
        var loginDep = {};

        function getLoginUser () {
            server.get('auth/getloginuser').then(function (result) {
                console.log(" > getloginuser", result.data.user);
                angular.extend(loginUser, result.data.user);
                console.log(" > loginUser", loginUser);
            });
        }

        function getLoginDep () {
            server.get('auth/getlogindep').then(function (result) {
                console.log(" > getlogindep", result.data.dep);
                angular.extend(loginDep, result.data.dep);
            });
        }
        function listDeps () {
            server.get('auth/listallchildrendep').then(function (result) {
                deps.length = 0;
                console.log(" > listdeps", result);
                angular.forEach(result.data.deps, function (item) {

                    if (item.Parent_id != 0) {
                        getDepById(item.Parent_id).then(function (department) {
                            item.Parent = department.data.dep;
                            deps.push(item);
                        });
                    } else {
                        deps.push(item);
                    }
                });
            });
        }

        function deleteDep (dep) {
            return server.post('auth/deletedep', {
                id : dep.Id
            });
        }

        function createDep (dep) {
            if(!dep.Name){
                $.smallBox({
                    title: "Create Dep Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Name is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if (!dep.Parent_id) {
                dep.Parent_id = 0;
            };
            var _dep = {
                id : dep.Id,
                name : dep.Name,
                parent_id : Number(dep.Parent_id),
                description : dep.Description
            };
            return server.post('auth/adddep', _dep);
        }

        function updateDep (dep) {
            var _dep = {
                id : dep.Id,
                name : dep.Name,
                grade : Number(dep.Grade),
                description : dep.Description
            };
            return server.post('auth/updatedep', _dep);
        }

        function setCurrentDep(dep) {
            angular.extend(currentDep, dep);
        }

        function getDepById (Id) {
            return server.get('auth/getdep?id=' +  Id);
        }

        function getRoleById (Id) {
            return server.get('auth/getrole?id=' +  Id);
        }
        //users

        var users = [];
        var currentUser = {};
        var userTypes = [];
        listUserTypes();

        function listUsers () {
            return server.get('auth/listusers').then(function (result) {
                users.length = 0;
                angular.forEach(result.data.users, function (item) {
                    if (item.Department_id != 0) {
                        getDepById(item.Department_id).then(function (department) {
                            item.department = department.data.dep;
                        });
                    }
                    angular.forEach(userTypes, function (userType) {
                        if (item.User_type == userType.Type_id) {
                            item.userType = userType;
                        };
                    })
                    users.push(item);
                    
                })
            });
        }

        function listUserTypes () {
            return server.get('auth/listusertypes').then(function (result) {
                userTypes.length = 0;
                angular.forEach(result.data.usertypes, function (item) {
                    userTypes.push(item);
                })
            });
        }

        function createUser (user) {
            if(!user.Username){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>UserName is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Email){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Email is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Password){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Password is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(user.Confirm_password != user.Password){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Password is not confirmed.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Department_id){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Department is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.User_type){
                $.smallBox({
                    title: "Create User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>User Type is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var _user = {
                email : user.Email,
                phone_number : user.Phone_numer,
                username : user.Username,
                password : $.md5(user.Password),
                department_id : Number(user.Department_id),
                user_type : Number(user.User_type)
            };
            return server.post('auth/adduser', _user);
        }

        function setCurrentUser (user) {
            user.Confirm_password = user.Password;
            angular.extend(currentUser, user);
        }
        function updateUser (user) {
            if(!user.Username){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>UserName is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Email){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Email is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Password){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Password is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(user.Confirm_password != user.Password){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Password is not confirmed.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.Department_id){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Department is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!user.User_type){
                $.smallBox({
                    title: "Edit User Error",
                    content: "<i class='fa fa-clock-o'></i> <i>User Type is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var _user = {
                id : user.Id,
                email : user.Email,
                phone_number : user.Phone_numer,
                username : user.Username,
                password : user.Password,
                department_id : Number(user.Department_id),
                user_type : Number(user.User_type)
            };
            return server.post('auth/updateuser', _user);
        }

        function deleteUser (user) {
            return server.post('auth/deleteuser', {
                id : user.Id
            });
        }

        //groups

        var groups = [];
        var currentGroup = {};
        function listGroups () {
            server.get('auth/listgroups').then(function (result) {
                groups.length = 0;
                angular.forEach(result.data.groups, function (item) {
                    if (item.Role_id != 0) {
                        getRoleById(item.Role_id).then(function (role) {
                            item.Role = role.data.role;
                            groups.push(item);
                        });
                    } else {
                        groups.push(item);
                    }
                })

            });
        }
        function setCurrentGroup (group) {
            angular.extend(currentGroup, group);
        }

        function addUserToGroup(group, user) {
            return server.post('auth/addusergroup', {
                group_id : Number(group.Id),
                user_id : Number(user.Id)
            });
        }

        function deleteUserFromGroup(group, user) {
            return server.post('auth/deleteusergroup', {
                group_id : Number(group.Id),
                user_id : Number(user.Id)
            });
        }

        function deleteGroup(group) {
            return server.post('auth/deletegroup', {
                id : Number(group.Id)
            });
        }

        function createGroup (group) {
            if(!group.Group_name){
                $.smallBox({
                    title: "Create Group Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Group Name is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!group.Role_id){
                $.smallBox({
                    title: "Create Group Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Role is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var _group = {
                group_name : group.Group_name,
                display_name : group.Display_name,
                description : group.Description,
                role_id : Number(group.Role_id)
            };

            return server.post('auth/addgroup', _group).then(function (result) {
                var _group = result.data;

                var taskList = [];
                angular.forEach(group.users, function (user) {
                    taskList.push(addUserToGroup(_group, user));
                });

                return $q.all(taskList);
            });
        }

        function getUsersOfGroup (group) {
            return server.get('auth/listgroupusers?id='+ group.Id);
        }

        function updateGroup (oldgroup, group) {
            var oldUsers = oldgroup.users || [], newUsers = group.users || [];
            console.log("oldUsers:"+oldUsers.length);
            console.log("newUsers:"+newUsers.length);
            var taskList = [];
            var _group = {
                id : group.Id,
                group_name : group.Group_name,
                display_name : group.Display_name,
                description : group.Description,
                role_id : Number(group.Role_id)
            };

            // angular.forEach(oldUsers, function (user) {
            //     if (newUsers.indexOf(user) == -1) {
            //         console.log("deleteUserFromGroup:"+user.Username);
            //         taskList.push(deleteUserFromGroup(group, user));
            //     }
            // });

            // angular.forEach(newUsers, function (user) {
            //     if (oldUsers.indexOf(user) == -1) {
            //         console.log("addUserToGroup:"+user.Username);
            //         taskList.push(addUserToGroup(group, user));
            //     }
            // });

            angular.forEach(oldUsers, function (oUser) {
                var delFlag = true;
                angular.forEach(newUsers, function (nUser) {
                    if (oUser.Id == nUser.Id) {
                        delFlag = false;
                    }
                });
                if (delFlag) {
                    console.log("deleteUserFromGroup:"+oUser.Username);
                    taskList.push(deleteUserFromGroup(group, oUser));
                };
            });

            angular.forEach(newUsers, function (nUser) {
                var addFlag = true;
                angular.forEach(oldUsers, function (oUser) {
                    if (oUser.Id == nUser.Id) {
                        addFlag = false;
                    }
                });
                if (addFlag) {
                    console.log("addUserToGroup:"+nUser.Username);
                    taskList.push(addUserToGroup(group, nUser));
                };
            });


            taskList.push(server.post('auth/updategroup', _group));

            return $q.all(taskList);
        }

        angular.extend(usersService, {
            deps : deps,
            currentDep : currentDep,
            listDeps : listDeps,
            deleteDep : deleteDep,
            createDep: createDep,
            setCurrentDep: setCurrentDep,
            updateDep : updateDep,


            users : users,
            currentUser : currentUser,
            setCurrentUser : setCurrentUser,
            createUser : createUser,
            listUsers : listUsers,
            updateUser : updateUser,
            deleteUser: deleteUser,

            groups : groups,
            currentGroup : currentGroup,
            setCurrentGroup : setCurrentGroup,
            listGroups : listGroups,
            createGroup : createGroup,
            deleteGroup : deleteGroup,
            updateGroup: updateGroup,
            getUsersOfGroup: getUsersOfGroup,

            loginUser : loginUser,
            loginDep : loginDep,
            getLoginUser : getLoginUser,
            getLoginDep : getLoginDep,
            userTypes : userTypes,
            listUserTypes : listUserTypes
        });

        return usersService;

    });
});