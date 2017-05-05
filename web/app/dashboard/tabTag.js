define(['dashboard/module','jquery'],function(module){

    'use strict';

    return module.registerDirective('tabTag',function(dashboardService){
       return {
           restrict: 'A',
           compile: function(){
               return {
                   post: function(scope){

                       var optionTag = $('div#history-header span');
                       var content = $('div#history-content div.history-detail');
                       for(var i=0;i<optionTag.length;i++){
                           optionTag[i].index = i;
                           optionTag[i].onclick = function(){
                               for(var j=0;j<content.length;j++){
                                   if(this.index==j){
                                       content[j].style.display = 'block';
                                   }else{
                                       content[j].style.display = 'none';
                                   }
                               }
                           }
                       }

                       $('div#history-header').find('span').bind('click',function(){
                           if($(this).hasClass('choosen')){
                               return;
                           }else{
                               $('div#history-header').find('span').each(function(){
                                   if($(this).hasClass('choosen')){
                                       $(this).removeClass('choosen');
                                   }
                               });
                               $(this).addClass('choosen');
                           }
                       });

                       dashboardService.listWeekHistory().then(function(result){
                           scope.weekHistory = result.data;
                           $('div#week-history img').css('display','none');
                           $('div#week-history table').css('display','block');
                       });

                       $('div#history-header span.month-history').one('click',function(){
                           dashboardService.listMonthHistory().then(function(result){
                               scope.monthHistory = result.data;
                               $('div#month-history img').css('display','none');
                               $('div#month-history table').css('display','block');
                           });
                       });

                       $('div#history-header span.all-history').one('click',function(){
                           dashboardService.listAllHistory().then(function(result){
                               scope.allHistory = result.data;
                               $('div#all-history img').css('display','none');
                               $('div#all-history table').css('display','block');
                           });
                       });

                   }
               }
           }
       }
    });
});
