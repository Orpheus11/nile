define(['modules/image/module'], function (module) {

    'use strict';

    module.registerController('ImageCtrl', function ($stateParams, imageService, imageServiceService, $scope) {
        $scope.image_server_id = $stateParams.imageserverid;
        function initUploadImage(){
            imageService.getImageServerDetail($stateParams.imageserverid,function(data) {
                $scope.image_server_ip = data.ip;
                $scope.vm_images = data.images;
            });
        }
        initUploadImage();
        $scope.showupload_ctl = false;
        $scope.showupload = function () {
            $scope.showupload_ctl = !$scope.showupload_ctl;
            if($scope.showupload_ctl == true){
                $("#preview-template").css("display","block");
                $('div.dz-preview').each(function(){
                    if($(this).hasClass($scope.image_server_id)){
                        $(this).css('display','inline-block');
                    }else{
                        $(this).css('display','none');
                    }
                })
            }else{
                $("#preview-template").css("display","none");
            }

            angular.element("#uploadimage").dropzone({
                addRemoveLinks: true,
                maxFilesize: 50000000,
                dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop files <span class="font-xs">to upload</span></span><span>&nbsp&nbsp<h4 class="display-inline"> (Or Click)</h4></span>',
                dictResponseError: 'Error uploading file!',
                previewsContainer: 'div#preview-template',
                url: "http://" + $scope.image_server_ip + "/uploadimagefile/upload",
                thumbnail: function(a,b){var c,d,e,f,g;if(a.previewElement){for(a.previewElement.classList.remove("dz-file-preview"),a.previewElement.classList.add("dz-image-preview"),f=a.previewElement.querySelectorAll("[data-dz-thumbnail]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],c.alt=a.name,g.push(c.src=b);return g}},
                error: function(a,b){var c,d,e,f,g;if(a.previewElement){for(a.previewElement.classList.add("dz-error"),"String"!=typeof b&&b.error&&(b=b.error),f=a.previewElement.querySelectorAll("[data-dz-errormessage]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.textContent=b);return g}},
                processing: function(a){
                  $('div.dz-preview').each(function(){
                     var judgeClass = $(this).attr('class');
                     if(judgeClass.length>28){
                         return;
                     }else{
                         $(this).addClass($scope.image_server_id);
                     }
                  });
                    return a.previewElement&&(a.previewElement.classList.add("dz-processing"),a._removeLink)?a._removeLink.textContent=this.options.dictCancelUpload:void 0},

                uploadprogress:function(a,b){var c,d,e,f,g;if(a.previewElement){for(f=a.previewElement.querySelectorAll("[data-dz-uploadprogress]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.style.width=""+b+"%");return g}},
                success: function(a){
                    if(a.status == "success"){
                        initUploadImage();
                    }
                    return a.previewElement?a.previewElement.classList.add("dz-success"):void 0
                }
            });
            imageServiceService.listImageServers();
            //console.log($("uploadimage").dropzone.url);
        }
        $scope.deleteimagefile = function (imageserver_id, id) {
            $.SmartMessageBox({
                title: "Delete Image File!",
                content: "Are You Sure To Delete Image File?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    imageServiceService.deleteimagefile(imageserver_id, id, function (data) {
                        $scope.return_data = data;
                        if ($scope.return_data.error != null) {

                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Image file Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else {
                            $.smallBox({
                                title: "Image File Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>File has been Deleted.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                            initUploadImage();
                            //$scope.UpdateImageTree();
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Image File Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete File Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });


        }
    });
});
