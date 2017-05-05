define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('navVMService', function($http,$log) {
        function CreateVM(info,callback) {
            var postData,config;
            if (info.vm_type == 'image'){
                postData = {cpu_num: info.cpu_num, memory: info.memory, ovsbr:info.ovsbr, selected_vlan: info.selected_vlan,
                    vm_name: info.vm_name, selected_image: info.selected_image, server_id: info.server_id,
                    description: info.description, selected_image_server: info.selected_image_server,
                    vm_type:info.vm_type,selected_storage:info.selected_storage,selected_storage_volume_id:info.selected_storage_volume_id,console_password:info.console_password};
                config = {};
            }
            if (info.vm_type == 'iso'){
                postData = {cpu_num: info.cpu_num, memory: info.memory, ovsbr:info.ovsbr, selected_vlan: info.selected_vlan,
                    vm_name: info.vm_name, selected_image: info.selected_image, server_id: info.server_id,
                    description: info.description, selected_image_server: info.selected_image_server,
                    disk_size:info.disk_size,vm_type:info.vm_type,selected_storage:info.selected_storage,selected_storage_volume_id:info.selected_storage_volume_id,console_password:info.console_password};
                config = {};
            }
            $http.post(appConfig.apiUrl+'/vms',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/delete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ShutdownVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/shutdown',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ForceShutdownVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/forceshutdown',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function StartVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/start',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function SuspendVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/suspend',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function ResumeVM(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/resume',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetVMConsole(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/console',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function MigrateVM(vm_id,server_id,callback){
            var postData = {vm_id:vm_id,dest_server_id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/migrate',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetSnapshotList(vm_id,callback){
            var postData = {vm_id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/listsnapshotbyvmid',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function AddSnapshotList(vm_id,snapshot_filename,snapshotDes,callback){
            var postData = {vm_id:vm_id,snapshot_filename:snapshot_filename,snapshotDes:snapshotDes};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/snapshot',postData,config).success(function(data){
                callback(data);
            }).error(function(){
               $log.log('Error');
                callback([]);
            });
        }

        function RestoreSnapshotList(vm_snapshot_id,vm_position,callback){
            var postData = {vm_snapshot_id:vm_snapshot_id,vm_position:vm_position};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/snapshotrestore',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteSnapshotList(vm_snapshot_id,callback){
            var postData = {vm_snapshot_id:vm_snapshot_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/snapshotdelete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        <!-- backupVM -->
        function GetBackupList(vm_id,callback){
            var postData = {vm_id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/listbackupbyvmid',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function AddBackupList(vm_id,backup_type,backup_filename,backupDes,callback){
            var postData = {vm_id:vm_id,backup_type:backup_type,backup_filename:backup_filename,backupDes:backupDes};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/backup',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function RestoreBackupList(vm_backup_id,vm_position,callback){
            var postData = {vm_backup_id:vm_backup_id,vm_position:vm_position};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/backuprestore',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteBackupList(vm_backup_id,callback){
            var postData = {vm_backup_id:vm_backup_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/backupdelete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function ListServerStorage(server_id,callback){
            var postData = {server_id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/storage/gluster/listservervolumebyserverid',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ListVMDetail(vm_id,callback){
            var postData = {vm_id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/listvmconfbyvmid',postData,config).success(function(data){
               callback(data);
            }).error(function(){
               $log.log('Error');
               callback([]);
            });
        }

        function EditVM(vm_id,cpu_num,description,memory,vm_name,callback){
            var postData = {vm_id:vm_id,cpu_num:cpu_num,description:description,memory:memory,vm_name:vm_name};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/editvm',postData,config).success(function(data){
               callback(data);
            }).error(function(){
               $log.log('Error');
                callback([]);
            });
        }


        function GetVMStatus(vm_id,callback){
            var postData = {vm_id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/getvmstatus',postData,config).success(function(data){
                callback(data);
            }).error(function(){
               $log.log('Error');
                callback([]);
            });
        }


        function TemplateVM(vm_id,template_name,callback){
            var postData = {id:vm_id, template_name:template_name};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/templatevm',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }


		return{
            getVMStatus:function(vm_id,callback){
                GetVMStatus(vm_id,callback);
            },
            editVM:function(vm_id,cpu_num,description,memory,vm_name,callback){
                EditVM(vm_id,cpu_num,description,memory,vm_name,callback);
            },
            listVMDetail:function(vm_id,callback){
                ListVMDetail(vm_id,callback);
            },
            createVM:function(info,callback){
                CreateVM(info,callback);
            },
            getVMConsole:function(vm_id,callback){
                GetVMConsole(vm_id,callback);
            },
            deleteVM:function(vm_id,callback){
                DeleteVM(vm_id,callback);
            },
            shutdownVM:function(vm_id,callback){
                ShutdownVM(vm_id,callback);
            },
            forceShutdownVM:function(vm_id,callback){
                ForceShutdownVM(vm_id,callback);
            },
            startVM:function(vm_id,callback){
                StartVM(vm_id,callback);
            },
            suspendVM:function(vm_id,callback){
                SuspendVM(vm_id,callback);
            },
            resumeVM:function(vm_id,callback){
                ResumeVM(vm_id,callback);
            },
            migrateVM:function(vm_id,server_id,callback){
                MigrateVM(vm_id,server_id,callback);
            },
            getSnapshotList:function(vm_id,callback){
                GetSnapshotList(vm_id,callback);
            },
            addSnapshotList:function(vm_id,snapshot_filename,snapshotDes,callback){
                AddSnapshotList(vm_id,snapshot_filename,snapshotDes,callback);
            },
            restoreSnapshotList:function(vm_snapshot_id,vm_position,callback){
                RestoreSnapshotList(vm_snapshot_id,vm_position,callback);
            },
            deleteSnapshotList:function(vm_snapshot_id,callback){
                DeleteSnapshotList(vm_snapshot_id,callback);
            },
            getBackupList:function(vm_id,callback){
                GetBackupList(vm_id,callback);
            },
            addBackupList:function(vm_id,backup_type,backup_filename,backupDes,callback){
                AddBackupList(vm_id,backup_type,backup_filename,backupDes,callback);
            },
            restoreBackupList:function(vm_backup_id,vm_position,callback){
                RestoreBackupList(vm_backup_id,vm_position,callback);
            },
            deleteBackupList:function(vm_backup_id,callback){
                DeleteBackupList(vm_backup_id,callback);
            },
            listServerStorage:function(server_id,callback){
                ListServerStorage(server_id,callback);
            },
            templateVM:function(vm_id,template_name,callback){
                TemplateVM(vm_id,template_name,callback);
            }
		}
	})
})
