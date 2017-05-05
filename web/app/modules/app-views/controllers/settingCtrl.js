define(['modules/app-views/module'], function (module) {

    'use strict';

    module.registerController('SettingCtrl', function ($scope,$http,User) {
        $scope.loginUser=User
        $scope.settingBase=function(){
            if($scope.loginUser.username==null){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>username is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.loginUser.username.trim()==""){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>username is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.loginUser.phonenumber==null){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>phonenumber is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.loginUser.phonenumber.trim()==""){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>phonenumber is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            var request = $http({
                method: "post",
                url: appConfig.apiUrl+"/auth/updateuser",
                data: {
                    id:$scope.loginUser.userid,
                    username:$scope.loginUser.username,
                    phone_number:$scope.loginUser.phonenumber
                }
            }).success(function(data){
                $.smallBox({
                    title: "Setting Success",
                    content: "<i class='fa fa-clock-o'></i> <i>Setting Success.</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                User.username=$scope.loginUser.username;
                User.phonenumber=$scope.loginUser.phonenumber;
            }).error(function(data) {
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>"+data.error+"</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $scope.errorInfo=data.error;
                return
            });

        };

        $scope.settingPwd=function(){
            if($scope.password==null){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>password is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.password.trim()==""){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>password is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            var password=$.md5($scope.password);

            if($scope.newpassword==null){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>newpassword is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.newpassword.trim()==""){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>newpassword is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            var newpassword=$.md5($scope.newpassword);

            if($scope.confirmpassword==null){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>confirmpassword is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.confirmpassword.trim()==""){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>confirmpassword is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            var confirmpassword=$.md5($scope.confirmpassword);
            if (password == newpassword){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>新密码和当前密码一样.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if (newpassword != confirmpassword){
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>密码确认不匹配.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var request = $http({
                method: "post",
                url: appConfig.apiUrl+"/auth/updateuserpassword",
                data: {
                    id:$scope.loginUser.userid,
                    password:password,
                    newpassword:newpassword
                }
            }).success(function(data){
                $.smallBox({
                    title: "Setting Success",
                    content: "<i class='fa fa-clock-o'></i> <i>Setting Success.</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                User.password=$scope.loginUser.password;
            }).error(function(data) {
                $.smallBox({
                    title: "Setting Error",
                    content: "<i class='fa fa-clock-o'></i> <i>"+data.error+"</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $scope.errorInfo=data.error;
                return
            });

        };
    });
});
