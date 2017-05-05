define(['../../../image/module', 'dropzone'], function (module) {

    'use strict';

    return module.registerDirective('smartDropzone', function (imageService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttributes) {
                tElement.removeAttr('smart-dropzone data-smart-dropzone');

                //console.log(tElement);
                /*imageService.watch("ip",function() {
                    var url = "http://" + imageService.ip + "/uploadimagefile/upload";


                });*/
                /*tElement.dropzone({
                    addRemoveLinks: true,
                    maxFilesize: 500000,
                    dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop files <span class="font-xs">to upload</span></span><span>&nbsp&nbsp<h4 class="display-inline"> (Or Click)</h4></span>',
                    dictResponseError: 'Error uploading file!',
                    url: "http://" + imageService.ip + "/uploadimagefile/upload"
                });*/
            }
        }
    });
});
