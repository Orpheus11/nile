define(['modules/compute/module','lodash'], function (module,_) {

    'use strict';

    module.registerController('ServerCtrl', function ($stateParams,serverService,$scope,monitorService,$interval) {
        $scope.server_id = $stateParams.serverid;

        $scope.timeTemps = ["one day","three days","one week"];
        serverService.getServerDetail($scope.server_id,function(data){
            $scope.server = data.server;
            $scope.server.LastCheck = $scope.server.LastCheck.replace(/-04:00/,"").replace(/\+08:00/,"").replace(/T/," ");


        });

        serverService.getServerVmsDetail($scope.server_id,function(data){
            $scope.server_vms = data.vms;
            //console.log($scope.server_vms);
        });

        serverService.getServerMacsDetail($scope.server_id,function(data){
            $scope.server_macs = data;
            //console.log($scope.server_macs);
        });

        serverService.getServerDisksDetail($scope.server_id,function(data){
           $scope.server_disks = data;
           //console.log($scope.server_disks);
        });

//---------monitor---------        
        var epoch = monitorService.getcurrentTime();
        $scope.liveStats = [];
   /*     monitorService.getVMMonitorLimitOneHour($scope.server_id).then(function(result){
            $scope.monitor_cpu = result.data.cpu;
            $scope.monitor_mem = result.data.mem;
            $scope.monitor_disk_r = result.data.disk_r;
            $scope.monitor_disk_w = result.data.disk_w;
            $scope.monitor_net_in = result.data.net_in;
            $scope.monitor_net_out = result.data.net_out;
            $scope.plot_cpu = {label: "CPU",color:"#00FFFF",data:$scope.monitor_cpu,lines: { show: true }};
            $scope.plot_mem = {label: "Memory",color:"#FF00FF",data:$scope.monitor_mem,lines: { show: true }};
            $scope.plot_disk_r = {label: "Disk Read",color:"#00FF99",data:$scope.monitor_disk_r,lines: { show: true }};
            $scope.plot_disk_w = {label: "Disk Write",color:"#00FF00",data:$scope.monitor_disk_w,lines: { show: true }};
            $scope.plot_net_in = {label: "Network In",color:"#CC6633",data:$scope.monitor_net_in,lines: { show: true }};
            $scope.plot_net_out = {label: "Network Out",color:"#CC9933",data:$scope.monitor_net_out,lines: { show: true }}; 
            //$scope.liveStats=[$scope.plot_cpu];
        });*/
        $scope.liveStatsOptions = {
            grid: {                
                    backgroundColor: "#000000",
                    tickColor: "#008040",
                    hoverable: true, 
                    clickable: true
                    },
            yaxis: { min: 0 },
            xaxis: { mode: 'time' ,
                     tickSize: [5, "minute"],
                     timeformat: "%H:%M", // format string to use
                     min: epoch - 3600000,//1 hour
                     max: epoch,
                     timezone: "browser",
                     twelveHourClock: true // 12 or 24 time in time mode
                    },
            series: {
                lines: {
                    lineWidth: 1,
                    fill: true,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.4
                            },
                            {
                                opacity: 0
                            }
                        ]
                    },
                    steps: false
                }
            }
        };
        $scope.cpu_show = true;
        $scope.mem_show = false;
        $scope.disk_r_show = false;
        $scope.disk_w_show = false;
        $scope.net_in_show = false;
        $scope.net_out_show = false;
        $("input[class='cpu_show']").bootstrapSwitch('state',true);
        $("input[class='mem_show']").bootstrapSwitch('state',false);
        $("input[class='disk_show']").bootstrapSwitch('state',false);
        $("input[class='net_show']").bootstrapSwitch('state',false);

        $("input[class='cpu_show']").on('switchChange.bootstrapSwitch',function(event,state){
            $scope.cpu_show = state;
            $scope.mem_show = false;
            $scope.disk_r_show = false;
            $scope.disk_w_show = false;
            $scope.net_in_show = false;
            $scope.net_out_show = false;
            watchFunction();
        });
        $("input[class='mem_show']").on('switchChange.bootstrapSwitch',function(event,state){
            $scope.mem_show = state;
            $scope.cpu_show = false;
            $scope.disk_r_show = false;
            $scope.disk_w_show = false;
            $scope.net_in_show = false;
            $scope.net_out_show = false;
            watchFunction();
        });
        $("input[class='disk_show']").on('switchChange.bootstrapSwitch',function(event,state){
            $scope.disk_r_show = state;
            $scope.disk_w_show = state;
            $scope.cpu_show = false;
            $scope.mem_show = false;
            $scope.net_in_show = false;
            $scope.net_out_show = false;
            watchFunction();
        });
        $("input[class='net_show']").on('switchChange.bootstrapSwitch',function(event,state){
            $scope.net_in_show = state;
            $scope.net_out_show = state;
            $scope.cpu_show = false;
            $scope.mem_show = false;
            $scope.disk_r_show = false;
            $scope.disk_w_show = false;
            watchFunction();
        });
        //$scope.select_show = [true,true,false,false,false,false];
        //$scope.change_selectShow = function (n,flag) {
        //    $scope.select_show[n] = flag;
        //    $scope.cpu_show = $scope.select_show[0];
        //    $scope.mem_show = $scope.select_show[1];
        //    $scope.disk_r_show = $scope.select_show[2];
        //    $scope.disk_w_show = $scope.select_show[3];
        //    $scope.net_in_show = $scope.select_show[4];
        //    $scope.net_out_show = $scope.select_show[5];
        //    watchFunction();
        //}

        $scope.autoUpdate = true;
        var updateInterval;
        function maxData(monitorValues){
            var maxValue = 0;
            for (var i = 0; i < monitorValues.length; i++) {
                if (maxValue < Number(monitorValues[i][1])) {
                    maxValue = Number(monitorValues[i][1]);
                };
            };
            return maxValue;
        }
        function minData(monitorValues){
            var minValue = Number(monitorValues[0][1]);
            for (var i = 0; i < monitorValues.length; i++) {
                if (minValue > Number(monitorValues[i][1])) {
                    minValue = Number(monitorValues[i][1]);
                };
            };
            return minValue;
        }
        $scope.cpu_up = false;
        $scope.mem_up = false;
        $scope.disk_r_up = false;
        $scope.disk_w_up = false;
        $scope.net_in_up = false;
        $scope.net_out_up = false;
        function watchServerCurrent(){
            var curretTime = monitorService.getcurrentTime();
            var chart_cpu = window.chart = $('#server_cpu').data('easyPieChart');
            var chart_mem = window.chart = $('#server_mem').data('easyPieChart');
            var chart_disk_r = window.chart = $('#server_disk_r').data('easyPieChart');
            var chart_disk_w = window.chart = $('#server_disk_w').data('easyPieChart');
            var chart_net_in = window.chart = $('#server_net_in').data('easyPieChart');
            var chart_net_out = window.chart = $('#server_net_out').data('easyPieChart');
            if ($scope.monitor_cpu.length >0) {
                $scope.cpu_max=maxData($scope.monitor_cpu);
                $scope.cpu_min=minData($scope.monitor_cpu);
                if ((curretTime - $scope.monitor_cpu[0][0]) > 60000) {
                    chart_cpu.update(0);
                }else{
                    chart_cpu.update($scope.monitor_cpu[0][1]);
                };
                if ($scope.monitor_cpu.length >1) {
                    if (Number($scope.monitor_cpu[0][1]) - Number($scope.monitor_cpu[1][1]) > 0) {
                        $scope.cpu_up = true;
                    }else{
                        $scope.cpu_up = false;
                    };
                };
            }else{
                chart_cpu.update(0);
                $scope.cpu_max=0;
                $scope.cpu_min=0;
            };

            if ($scope.monitor_mem.length >0) {
                $scope.mem_max=maxData($scope.monitor_mem);
                $scope.mem_min=minData($scope.monitor_mem);
                // chart_mem.update($scope.monitor_mem[0][1]);
                if ((curretTime - $scope.monitor_mem[0][0]) > 60000) {
                    chart_mem.update(0);
                }else{
                    chart_mem.update($scope.monitor_mem[0][1]);
                };
                if ($scope.monitor_mem.length >1) {
                    if (Number($scope.monitor_mem[0][1]) - Number($scope.monitor_mem[1][1]) > 0) {
                        $scope.mem_up = true;
                    }else{
                        $scope.mem_up = false;
                    };
                };
            }else{
                chart_mem.update(0);
                $scope.mem_max=0;
                $scope.mem_min=0;
            };

            if ($scope.monitor_disk_r.length >0) {
                $scope.disk_r_max=maxData($scope.monitor_disk_r);
                $scope.disk_r_min=minData($scope.monitor_disk_r);
                if ((curretTime - $scope.monitor_disk_r[0][0]) > 60000) {
                    chart_disk_r.update(0);
                }else{
                    chart_disk_r.update($scope.monitor_disk_r[0][1]);
                };
                if ($scope.monitor_disk_r.length >1) {
                    if (Number($scope.monitor_disk_r[0][1]) - Number($scope.monitor_disk_r[1][1]) > 0) {
                        $scope.disk_r_up = true;
                    }else{
                        $scope.disk_r_up = false;
                    };
                };
            }else{
                chart_disk_r.update(0);
                $scope.disk_r_max=0;
                $scope.disk_r_min=0;
            };

            if ($scope.monitor_disk_w.length >0) {
                $scope.disk_w_max=maxData($scope.monitor_disk_w);
                $scope.disk_w_min=minData($scope.monitor_disk_w);
                if ((curretTime - $scope.monitor_disk_w[0][0]) > 60000) {
                    chart_disk_w.update(0);
                }else{
                    chart_disk_w.update($scope.monitor_disk_w[0][1]);
                };
                if ($scope.monitor_disk_w.length >1) {
                    if (Number($scope.monitor_disk_w[0][1]) - Number($scope.monitor_disk_w[1][1]) > 0) {
                        $scope.disk_w_up = true;
                    }else{
                        $scope.disk_w_up = false;
                    };
                };
            }else{
                chart_disk_w.update(0);
                $scope.disk_w_max=0;
                $scope.disk_w_min=0;
            };

            if ($scope.monitor_net_in.length >0) {
                $scope.net_in_max=maxData($scope.monitor_net_in);
                $scope.net_in_min=minData($scope.monitor_net_in);
                if ((curretTime - $scope.monitor_net_in[0][0]) > 60000) {
                    chart_net_in.update(0);
                }else{
                    chart_net_in.update($scope.monitor_net_in[0][1]);
                };
                if ($scope.monitor_net_in.length >1) {
                    if (Number($scope.monitor_net_in[0][1]) - Number($scope.monitor_net_in[1][1]) > 0) {
                        $scope.net_in_up = true;
                    }else{
                        $scope.net_in_up = false;
                    };
                };
            }else{
                $scope.net_in_max=0;
                $scope.net_in_min=0;
                chart_net_in.update(0);
            };

            if ($scope.monitor_net_out.length >0) {
                $scope.net_out_max=maxData($scope.monitor_net_out);
                $scope.net_out_min=minData($scope.monitor_net_out);
                if ((curretTime - $scope.monitor_net_out[0][0]) > 60000) {
                    chart_net_out.update(0);
                }else{
                    chart_net_out.update($scope.monitor_net_out[0][1]);
                };
                if ($scope.monitor_net_out.length >1) {
                    if (Number($scope.monitor_net_out[0][1]) - Number($scope.monitor_net_out[1][1]) > 0) {
                        $scope.net_out_up = true;
                    }else{
                        $scope.net_out_up = false;
                    };
                };
            }else{
                chart_net_out.update(0);
                $scope.net_out_max=0;
                $scope.net_out_min=0;
            };
        }

        function watchFunction(){

            if (document.getElementById("monitor-chart") != null) {
                    monitorService.getMonitorLimitOneHour($scope.server_id).then(function(result){
                        $scope.monitor_cpu = result.data.cpu;
                        $scope.monitor_mem = result.data.mem;
                        $scope.monitor_disk_r = result.data.disk_r;
                        $scope.monitor_disk_w = result.data.disk_w;
                        $scope.monitor_net_in = result.data.net_in;
                        $scope.monitor_net_out = result.data.net_out;
                        $scope.liveData = [];
                        $scope.plot_cpu = {label: "CPU",color:"#00FFFF",data:$scope.monitor_cpu,lines: { show: true }};
                        $scope.plot_mem = {label: "Memory",color:"#FF00FF",data:$scope.monitor_mem,lines: { show: true }};
                        $scope.plot_disk_r = {label: "Disk Read",color:"#00FF99",data:$scope.monitor_disk_r,lines: { show: true }};
                        $scope.plot_disk_w = {label: "Disk Write",color:"#00FF00",data:$scope.monitor_disk_w,lines: { show: true }};
                        $scope.plot_net_in = {label: "Network In",color:"#CC6633",data:$scope.monitor_net_in,lines: { show: true }};
                        $scope.plot_net_out = {label: "Network Out",color:"#CC9933",data:$scope.monitor_net_out,lines: { show: true }};
                        // $scope.liveData = [$scope.plot_cpu,$scope.plot_mem];
                        watchServerCurrent();
                        if ($scope.cpu_show) {
                            $scope.liveData.push($scope.plot_cpu);
                        };
                        if ($scope.mem_show) {
                            $scope.liveData.push($scope.plot_mem);
                        };
                        if ($scope.disk_r_show) {
                            $scope.liveData.push($scope.plot_disk_r);
                        };
                        if ($scope.disk_w_show) {
                            $scope.liveData.push($scope.plot_disk_w);
                        };
                        if ($scope.net_in_show) {
                            $scope.liveData.push($scope.plot_net_in);
                        };
                        if ($scope.net_out_show) {
                            $scope.liveData.push($scope.plot_net_out);
                        };
                        var epochT = monitorService.getcurrentTime();
                        $.plot($("#monitor-chart"),$scope.liveData, {
                            // legend: {labelBoxBorderColor: "#fff"},
                            grid: {                
                                backgroundColor: "#000000",
                                tickColor: "#008040",
                                hoverable: true, 
                                clickable: true
                                },
                            // grid: { hoverable: true, clickable: true }, 
                            yaxis: { min: 0 },
                            xaxis: { mode: 'time' ,
                                     tickSize: [5, "minute"],
                                     timeformat: "%H:%M", // format string to use
                                     min: epochT - 3540000,//1 hour
                                     max: epochT,
                                     timezone: "browser",
                                     twelveHourClock: true // 12 or 24 time in time mode
                                    },
                            series: {
                                lines: {
                                    lineWidth: 1,
                                    fill: true,
                                    fillColor: {
                                        colors: [
                                            {
                                                opacity: 0.4
                                            },
                                            {
                                                opacity: 0
                                            }
                                        ]
                                    },
                                    steps: false
                                }
                            }
                        });
                    });

            };


            var previousPoint = null;
            $("#monitor-chart").bind("plothover", 
                function (event, pos, item) {
                    if (item) {
                        if (previousPoint != item.dataIndex) {
                            previousPoint = item.dataIndex;
                            
                            $("#tooltip").remove();
                            var item_series_label = item.series.label;
                            var item_p = "kbps";
                            if (item_series_label=="CPU" || item_series_label=="Memory") {
                                item_p = "%";
                            };
                            var x = item.datapoint[0].toFixed(2),
                                y = item.datapoint[1].toFixed(2);
                            var x_date = new Date(Number(x));
                            showTooltip(
                                    item.pageX, 
                                    item.pageY, 
                                    "Item:" + item_series_label + "</br>Value:" + y + item_p
                                    + "</br>Time:" + x_date.toLocaleString()
                                );
                        }
                    }else {
                        $("#tooltip").remove();
                        previousPoint = null;            
                    }
                }
            );
    
            //显示坐标跟随
            function showTooltip(x, y, contents) {
                $('<div id="tooltip">' + contents + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: y + 5,
                    left: x + 5,
                    border: '1px solid #000',
                    padding: '2px',
                    'background-color': '#fee',
                    opacity: 0.80
                }).appendTo("body").fadeIn(1);
            }

        }
        var watch = $scope.$watch('autoUpdate', function(autoUpdate){
            if(autoUpdate){
                watchFunction();
                updateInterval = $interval(function(){
                    watchFunction();
                }, 5000)
            } else {
                $interval.cancel(updateInterval);
            }
        });
        $scope.$on("$destroy",function( event ) {
                $interval.cancel(updateInterval);
                $interval.cancel(monitorInterval);
            }
        );
//----------------

        $scope.all_monitor_cpu = null;
        $scope.all_monitor_mem = "";
        $scope.all_monitor_disk = "";
        $scope.all_monitor_net = "";
        monitorService.getMonitor($scope.server_id).then(function(result){
            $scope.all_monitor_cpu = "";
            $scope.all_monitor_cpu = result.data.cpu;
            $scope.all_monitor_mem = result.data.mem;
            $scope.all_monitor_disk = result.data.disk;
            $scope.all_monitor_net = result.data.net;
            // monitorShow();
        })
        var monitorInterval;
        $scope.monitorShow = function (){
            $scope.all_monitor_update = true;
            $scope.$watch('all_monitor_update', function(all_monitor_update){
                if(all_monitor_update){
                    monitorInterval = $interval(function(){
                        if ($scope.all_monitor_cpu != null) {
                            var cpu = document.getElementById("cpu");
                            var mem = document.getElementById("mem");
                            var disk = document.getElementById("disk");
                            var net = document.getElementById("net");
                            new Dygraph(cpu,"Date,Cpu\n" + $scope.all_monitor_cpu , {
                                // rollPeriod : 14,
                                // showRoller : true,
                                customBars : false,
                                // ylabel : 'CPU_Used (%)',
                                legend : 'always',
                                labelsDivStyles : {
                                    'textAlign' : 'right'
                                },
                                showRangeSelector : true,
                                rangeSelectorHeight : 30,
                                rangeSelectorPlotStrokeColor : 'blue',
                                rangeSelectorPlotFillColor : 'lightblue'
                            });

                            new Dygraph(mem,"Date,Memory\n" + $scope.all_monitor_mem , {
                            // rollPeriod : 14,
                            // showRoller : true,
                            customBars : false,
                            // ylabel : 'Memory_Used (%)',
                            legend : 'always',
                            labelsDivStyles : {
                                'textAlign' : 'right'
                            },
                            showRangeSelector : true,
                            rangeSelectorHeight : 30,
                            rangeSelectorPlotStrokeColor : 'red',
                            rangeSelectorPlotFillColor : 'pink'
                            });
                            new Dygraph(disk,"Date,Disk_r,Disk_w\n" + $scope.all_monitor_disk , {
                            // rollPeriod : 14,
                            // showRoller : true,
                            customBars : false,
                            // ylabel : 'Disk_IO (b)',
                            legend : 'always',
                            labelsDivStyles : {
                                'textAlign' : 'right'
                            },
                            showRangeSelector : true,
                            rangeSelectorHeight : 30,
                            rangeSelectorPlotStrokeColor : 'green',
                            rangeSelectorPlotFillColor : 'lightgreen'
                            });
                            new Dygraph(net,"Date,Net_in,Net_out\n" + $scope.all_monitor_net , {
                            // rollPeriod : 14,
                            // showRoller : true,
                            customBars : false,
                            // ylabel : 'Network_IO (kbps)',
                            legend : 'always',
                            labelsDivStyles : {
                                'textAlign' : 'right'
                            },
                            showRangeSelector : true,
                            rangeSelectorHeight : 30,
                            rangeSelectorPlotStrokeColor : 'yellow',
                            rangeSelectorPlotFillColor : 'lightyellow'
                            });


                            $interval.cancel(monitorInterval);
                        };
                    }, 500)
                } else {
                    $interval.cancel(monitorInterval);
                }
            });

    }

//---------------------


    });

});
