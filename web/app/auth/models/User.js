define(['auth/module'], function (module) {

    'use strict';

   return module.registerFactory('User', function ($http, $q) {
        var dfd = $q.defer();

        var UserModel = {
            initialized: dfd.promise,
            userid: undefined,
            username: undefined,
            email: undefined,
            // password: undefined,
            phonenumber: undefined,
            depid: undefined,
            depname: undefined,
            picture: undefined,
            user_type: undefined,
            getLoginUser: getLoginUser
        };

         $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
            if (response.data.user) {
                 UserModel.userid = response.data.user.Id;
                 UserModel.username = response.data.user.Username;
                 UserModel.email = response.data.user.Email;
                 // UserModel.password = response.data.user.Password;
                 UserModel.depid = response.data.user.DepartmentId;
                 UserModel.phonenumber = response.data.user.Phone_numer;
                 UserModel.user_type = response.data.user.User_type;
                 UserModel.picture= "styles/img/avatars/1.png";
                 $http.get(appConfig.apiUrl+'/auth/getlogindep').then(function(response){
                     UserModel.depname = response.data.dep.Name;
                     dfd.resolve(UserModel)
                 });
                 dfd.resolve(UserModel)
            };
         });

         function getLoginUser(){
            $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
                 UserModel.userid = response.data.user.Id;
                 UserModel.username = response.data.user.Username;
                 UserModel.email = response.data.user.Email;
                 // UserModel.password = response.data.user.Password;
                 UserModel.depid = response.data.user.DepartmentId;
                 UserModel.phonenumber = response.data.user.Phone_numer;
                 UserModel.user_type = response.data.user.User_type;
                 UserModel.picture= "styles/img/avatars/1.png";
                 $http.get(appConfig.apiUrl+'/auth/getlogindep').then(function(response){
                     UserModel.depname = response.data.dep.Name;
                     dfd.resolve(UserModel)
                 });
                 dfd.resolve(UserModel)
             });
            return UserModel;
         }

         return UserModel;

        // var userid = undefined;
        // var username = undefined;
        // var email = undefined;
        // // password: undefined,
        // var phonenumber = undefined;
        // var depid = undefined;
        // var depname = undefined;
        // var picture = undefined;
        //  $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
        //     angular.extend(username, response.data.user.Username);
        //     angular.extend(email, response.data.user.Email);
        //     angular.extend(depid, response.data.user.DepartmentId);
        //     angular.extend(phonenumber, response.data.user.Phone_numer);
        //     angular.extend(picture, "styles/img/avatars/1.png");
        //     angular.extend(userid, response.data.user.Id);
        //     $http.get(appConfig.apiUrl+'/auth/getlogindep').then(function(response){
        //         depname = response.data.dep.Name;
        //         angular.extend(depname, response.data.dep.Name);
        //     });
        //  });
        //  function getLoginUser(){
        //      $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
        //         angular.extend(username, response.data.user.Username);
        //         angular.extend(email, response.data.user.Email);
        //         angular.extend(depid, response.data.user.DepartmentId);
        //         angular.extend(phonenumber, response.data.user.Phone_numer);
        //         angular.extend(picture, "styles/img/avatars/1.png");
        //         angular.extend(userid, response.data.user.Id);
        //         $http.get(appConfig.apiUrl+'/auth/getlogindep').then(function(response){
        //             depname = response.data.dep.Name;
        //             angular.extend(depname, response.data.dep.Name);
        //         });
        //      });
        //  }
        // angular.extend(User, {
        //     userid: userid,
        //     username: username,
        //     email: email,
        //     phonenumber: phonenumber,
        //     depid: depid,
        //     depname: depname,
        //     picture: picture,

        //     getLoginUser: getLoginUser
        // });

        // return User;


    });

});
