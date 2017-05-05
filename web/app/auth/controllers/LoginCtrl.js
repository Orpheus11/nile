define(['auth/module'], function (module) {

    "use strict";

    module.registerController('LoginCtrl', function ($scope, $state, $http,User,$document) {
        var currentHeight = document.documentElement.clientHeight+"px";
        $("#loginMain").css("height",currentHeight);
        function loginWeb(){
            if($scope.email==null){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入用户名</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.email.trim()==""){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入用户名</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.password==null){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入密码</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            if($scope.password.trim()==""){
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入密码</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            };
            var password=$.md5($scope.password);
            var request = $http({
                method: "post",
                url: appConfig.apiUrl+"/login",
                // params: {
                //     email:$scope.email,
                //     password:password
                // }
                data: {
                    email:$scope.email,
                    password:password
                }
            }).success(function(data){
                if (data.success==true) {
                    User.getLoginUser();
                    $state.go('app.dashboard');
                    return
                };
                $scope.errorInfo=data.error;
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入正确的用户名和密码</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $state.go('login');
                return
            }).error(function(data) {
                $.smallBox({
                    title: "Login Error",
                    content: "<i class='fa fa-clock-o'></i> <i>请输入正确的用户名和密码</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $scope.errorInfo=data.error;
                return
            });
        }
        $document.bind("keypress",function(event){
            $scope.$apply(function(){
                if(event.keyCode == 13){
                    loginWeb();
                }
            })
        });
        $scope.loginFn=function(){
            loginWeb();
        }
    })
});
