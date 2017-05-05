define([
    // account
    'auth/module',
    'auth/models/User',
    'filters',
    'server',
    'directives',
    // layout

    'layout/module',
    'layout/actions/minifyMenu',
    'layout/actions/toggleMenu',
    'layout/actions/fullScreen',
    'layout/actions/resetWidgets',
    'layout/actions/resetWidgets',
    'layout/actions/searchMobile',
    'layout/directives/demo/demoStates',
    'layout/directives/smartInclude',
    'layout/directives/smartDeviceDetect',
    'layout/directives/smartFastClick',
    'layout/directives/smartLayout',
    'layout/directives/smartSpeech',
    'layout/directives/smartRouterAnimationWrap',
    'layout/directives/smartFitAppView',
    'layout/directives/radioToggle',
    'layout/directives/dismisser',
    'layout/directives/smartMenu',
    'layout/directives/bigBreadcrumbs',
    'layout/directives/stateBreadcrumbs',
    'layout/directives/smartPageTitle',
    'layout/directives/hrefVoid',
    'layout/service/SmartCss',
    'modules/widgets/directives/widgetGrid',
    'modules/widgets/directives/jarvisWidget',


    // dashboard
    'dashboard/module',


    //components
    'components/language/Language',
    'components/language/languageSelector',
    'components/language/language-controller',

    'components/projects/Project',
    'components/projects/recentProjects',

    'components/activities/activities-controller',
    'components/activities/activities-dropdown-toggle-directive',
    'components/activities/activities-service',

    'components/shortcut/shortcut-directive',

    'components/calendar/module',
    'components/calendar/models/CalendarEvent',
    'components/calendar/directives/fullCalendar',
    'components/calendar/directives/dragableEvent',
    'components/calendar/controllers/CalendarCtrl',

    'components/inbox/module',
    'components/inbox/models/InboxConfig',
    'components/inbox/models/InboxMessage',

    'components/todo/TodoCtrl',
    'components/todo/models/Todo',
    'components/todo/directives/todoList',

    // chat
    'components/chat/module',

    // graphs
    'modules/graphs/module',


    // tables
    'modules/tables/module',

    // forms
    'modules/forms/module',

    // ui
    'modules/ui/module',

    // widgets
    'modules/widgets/module',

    // widgets
    'modules/maps/module',

    // appViews
    'modules/app-views/module',

    // misc
    'modules/misc/module',

    // smartAdmin
    'modules/smart-admin/module',

    //Add by CCWING
    'layout/controller/NavComputeCtrl',
    'layout/service/NavComputeService',
    'layout/directives/contextMenu',
    'layout/service/contextMenu',
    'layout/controller/NavCenterCtrl',
    'layout/service/NavCenterService',
    'layout/controller/NavServerCtrl',
    'layout/service/NavServerService',
    'layout/service/NavVMService',
    'layout/controller/NavVMCtrl',
    'layout/service/NavNetworkService',

    'layout/controller/NavNetworkCtrl',
    'layout/service/NavPolicyService',
    
    //Add by CCwing
    'layout/service/NavImageService',
    'layout/service/centersService',
    'layout/controller/NavImageCtrl',

    // Add by CCwing network
    'modules/net/module',
    'modules/net/service/networkService',
    'modules/net/controllers/ippoolCtrl',
    'modules/net/controllers/vxnetCtrl',
    'modules/net/directives/nettableTableTools',
    'modules/net/directives/vxnetTable',
    'modules/net/controllers/networkServerCtrl',

    'layout/directives/DialogLauncher',
    'layout/directives/imagetableTableTools',

    //compute
    'modules/compute/module',
    'modules/compute/service/VMService',
    'modules/compute/service/ServerService',
    'modules/compute/service/MonitorService',
    'modules/compute/service/CenterService',
    'modules/compute/service/DataCenterService',

    //console server
    'layout/service/NavConsoleService',
    'layout/controller/NavConsoleCtrl',

    'modules/storage/module',
    'modules/storage/service/glusterService',
    'modules/storage/service/nfsService',
    'modules/storage/service/storageService',

    'layout/controller/NavStorageCtrl',
    'layout/service/NavStorageService',

    'modules/privilege/module',
    'modules/privilege/service/usersService',
    'modules/privilege/service/rolesService',
    //image services
    'modules/image/module',
    'modules/image/service/ImageService',
    'modules/image/service/ImageServiceService',

 //Console services
    'modules/console/module',
    'modules/console/service/ConsoleService',

    'dashboard/DashboardService'


], function () {
    'use strict';
});
