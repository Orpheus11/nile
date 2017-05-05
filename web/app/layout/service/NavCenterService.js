define(['app',
    'appConfig'], function(app){
    "use strict";

	    return app.factory('navCenterService', function($http,$log) {

            function AddCenter(center_name,center_des,callback){
                var postData = {name:center_name,id:'',description:center_des};
                var config = {};
                $http.post(appConfig.apiUrl+'/centers',postData,config).success(function(data){

                    callback(data);

                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });

            }

            function EditCenter(center_id,center_name,des,callback){
                var postData = {name:center_name,id:center_id,description:des};
                var config = {};
                $http.post(appConfig.apiUrl+'/centers/edit',postData,config).success(function(data){

                    callback(data);

                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });

            }

            function DeleteCenter(center_id,callback){
                var postData = {id:center_id};
                var config = {};
                $http.post(appConfig.apiUrl+'/centers/delete',postData,config).success(function(data){
                    callback(data);
                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });
            }

            // function SetHighAvailable($scope,callback){
            //     var postData = {entity_id:$scope.center_id,entity_type:$scope.center_type,general_object:{
            //         enable_ha:$scope.enable_ha,failover:$scope.failover,migrate_back:$scope.migrate_back,
            //         use_standby:$scope.use_standby,preferred_servers_list:$scope.preferred_servers_list,
            //         vm_priority_list:$scope.vm_priority_list
            //         // ,advance_object:{wait_interval:$scope.wait_interval,retry_count:$scope.retry_count}
            //     }};
            //     var config = {};
            //     console.log(postData);
            //     $http.post(appConfig.apiUrl+'/ha/handleha',postData,config).success(function(data){
            //         callback(data);
            //     }).error(function(){
            //         $log.log('Error');
            //         callback([]);
            //     });
            // }




		
		return{
            addCenter:function(center_name,des,callback){
                AddCenter(center_name,des, callback);
            },
            editCenter:function(center_id,center_name,des,callback){
                EditCenter(center_id,center_name,des, callback);
            },
            deleteCenter:function(center_id,callback){
                DeleteCenter(center_id, callback);
            }
            // ,

            // setHighAvailable:function($scope,callback){
            //     SetHighAvailable($scope,callback);
            // }

		}
	})
})
