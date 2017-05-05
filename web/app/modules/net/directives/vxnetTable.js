define(['modules/net/module', 'jqgrid', 'jqgrid-locale-en','appConfig'], function (module) {

    'use strict';

    module.registerDirective('jqGrid', function ($compile) {
        var jqGridCounter = 0;

        return {
            replace: true,
            restrict: 'E',
            scope: {
                gridData: '='
            },
            template: '<div>' +
                '<table></table>' +
                '<div class="jqgrid-pagination"></div>' +
                '</div>',
            // controller: function($scope, $element){
            //     $scope.editRow  = function(row){
            //         $element.find('table').editRow(row);
            //     };
            //     $scope.saveRow  = function(row){
            //         $element.find('table').saveRow(row);
            //     };
            //     $scope.restoreRow  = function(row){
            //         $element.find('table').restoreRow(row);
            //     };
            // },
            link: function (scope, element) {
                var gridNumber = jqGridCounter++;
                var wrapperId = 'jqgrid-' + gridNumber;
                element.attr('id', wrapperId);

                var tableId = 'jqgrid-table-' + gridNumber;
                var table = element.find('table');
                table.attr('id', tableId);

                var pagerId = 'jqgrid-pager-' + gridNumber;
                element.find('.jqgrid-pagination').attr('id', pagerId);
                var selectOptions = scope.gridData;
                table.jqGrid({
                    // data : scope.gridData.data,
                    // datatype : "local",
                    url:appConfig.apiUrl+"/vlans",
                    datatype : "json",
                    height : 'auto',
                    // colNames : scope.gridData.colNames || [],
                    // colModel : scope.gridData.colModel || [],
                    colNames: [
                    'Id', 'Vlan_id', 'Name', 'Description', 'Cidr', 'Dhcp Range', 'Interface'],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            width:55,
                        },
                        {
                            name: 'vlan_id',
                            index: 'vlan_id',
                            width:55,
                            editable: true,
                            editrules:{edithidden:true,required:true,number:true,minValue:1,maxValue:4096}
                        },
                        {
                            name: 'name',
                            index: 'name',
                            editable: true
                        },
                        {
                            name: 'description',
                            index: 'description',
                            sortable: false,
                            editable: true,
                            edittype:"textarea", 
                            editoptions:{rows:"2",cols:"20",
                                // dataEvents: [
                                //     { 
                                //         type: 'change', 
                                //         data: { i: '' },
                                //         fn: function(e) { 
                                //             alert(e.data.i+":"+this.value);
                                //             console.log('onMouseOut'); 
                                //         } 
                                //     }
                                // ] 
                            }
                        },
                        {
                            name: 'cidr',
                            index: 'cidr',
                            // align: "right",
                            editable: true,
                            // editoptions:{readonly:true}
                        },
                        {
                            name: 'dhcp_range',
                            index: 'dhcp_range',
                            // align: "right",
                            editable: true,
                            // editoptions:{readonly:true}
                        },
                        {
                            name: 'interface',
                            index: 'interface',
                            // align: "right",
                            editable: true,
                            edittype:"select",
                            // editoptions:{value:"enp0s3:enp0s3;enp0s8:enp0s8"}
                            editoptions:{value:""+selectOptions}
                        }
                    ],
                    rowNum : 10,
                    rowList : [10, 20, 30],
                    pager : '#' + pagerId,
                    sortname : 'id',
                    toolbarfilter : true,
                    viewrecords : true,
                    sortorder : "asc",
                    editurl : appConfig.apiUrl+"/vlans",
                    caption : "Vlan List",
                    multiselect : true,
                    autowidth : true
                });
                table.jqGrid('navGrid', '#' + pagerId, {
                    edit : true,
                    add : true,
                    del : true
                });
                // table.jqGrid('inlineNav', '#' + pagerId);

                element.find(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
                element.find(".ui-jqgrid-view").children().removeClass("ui-widget-header ui-state-default");
                element.find(".ui-jqgrid-labels, .ui-search-toolbar").children().removeClass("ui-state-default ui-th-column ui-th-ltr");
                element.find(".ui-jqgrid-pager").removeClass("ui-state-default");
                element.find(".ui-jqgrid").removeClass("ui-widget-content");

                // add classes
                element.find(".ui-jqgrid-htable").addClass("table table-bordered table-hover");
                element.find(".ui-jqgrid-btable").addClass("table table-bordered table-striped");

                element.find(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
                element.find(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
                element.find(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
                element.find(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
                element.find(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
                element.find(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
                element.find(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
                element.find(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");

                element.find(".ui-icon.ui-icon-seek-prev").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");

                element.find(".ui-icon.ui-icon-seek-first").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");

                element.find(".ui-icon.ui-icon-seek-next").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");

                element.find(".ui-icon.ui-icon-seek-end").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");

                $(window).on('resize.jqGrid', function() {
                   table.jqGrid('setGridWidth', $("#content").width());
                });


                $compile(element.contents())(scope);
            }
        }
    });
});
