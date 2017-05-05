define(['layout/module', 'jquery-ui'], function (module) {

    'use strict';

//    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
//        _title: function (title) {
//            if (!this.options.title) {
//                title.html("&#160;");
//            } else {
//                title.html(this.options.title);
//            }
//        }
//    }));


    module.registerDirective('dialogLauncher', function () {
        return {
            restrict: 'A',
            compile: function (element, attributes) {
                element.removeAttr('dialog-launcher data-dialog-launcher');
                element.on('click', function (e) {
                    $(attributes.dialogLauncher).dialog('open');
                    e.preventDefault();
                })
            }
        }
    });
});