define(['app',
    'appConfig'], function(app) {
    "use strict";


    return app.factory('rolesService', function ($http, $log, $q, server) {
        var rolesService = {};

        var roles = [];
        var currentRole = {};
        var entityTypes = [];


        function listRoles () {
            console.log("listRoles called ");
            server.get('auth/listroles').then(function (result) {
                roles.length = 0;
                angular.forEach(result.data.roles, function (role) {
                    roles.push(role);
                })
            });
        }

        function setCurrentRole (role) {
           angular.extend( currentRole, role);
        }

        function createRole (role) {
            var _role = {
                name : role.Name,
                description : role.Description
            };

            var taskList = [];

            // angular.forEach(role.entities, function (entity) {
            //     taskList.push(addEntityToRole(role, entity));
            // });

            // taskList.push(server.post('auth/addrole', _role));

            // return $q.all(taskList);
            return server.post('auth/addrole', _role);

        }

        function deleteEntityFromRole (role, entity) {
            return server.post('auth/deleterep', {
                role_id : role.Id,
                entity_id: entity.Entity_id
            });
        }

        function addEntityToRole (role, entity) {
            return server.post('auth/addrep', {
                role_id : role.Id,
                entity_id: entity.Entity_id
            });
        }

        function addEntitiesToRole(role_id, entityIds) {
            return server.post('auth/addreps', {
                role_id : Number(role_id),
                entity_ids: entityIds
            });
        }

        function updateRole (role) {
            var _role = {
                id : role.Id,
                name : role.Name,
                description : role.Description
            };
            return server.post('auth/updaterole', _role);
        }

        function deleteRole (role) {
            return server.post('auth/deleterole', {
                id : role.Id
            });
        }

        var entities = [];
        var entitiesTreeNodes = [];
        function listEntities () {
            listEntityTypes();
            server.get('auth/listentities').then(function (result) {
                entities.length = 0 ;
                angular.forEach(result.data.entities, function (entity) {
                    angular.forEach(entityTypes,function (type) {
                        if (entity.Type_id == type.Id) {
                            entity.Type = type
                        };
                    });
                    entities.push(entity);
                });
            });
        }

        function listEntitiesTreeNodes () {
            server.get('auth/listentitiestreenodes').then(function (result) {
                entitiesTreeNodes.length = 0 ;
                angular.forEach(result.data.entitiestreenodes, function (entityNode) {
                    // var node = {id : entityNode.id, parent : entityNode.parent, text : entityNode.text, state: { opened: true},type:entityNode.type };
                    entitiesTreeNodes.push(entityNode);
                });
            });
        }

        function getEntitiesByRole (role) {
            return server.get('auth/listentitiesbyroleid?role_id=' + role.Id);
        }

        function listEntityTypes () {
            server.get('auth/listentitytypes').then(function (result) {
                entityTypes.length = 0;
                angular.forEach(result.data.entitytypes, function (type) {
                    entityTypes.push(type);
                })
            });
        }
        angular.extend(rolesService, {
            listRoles : listRoles,
            roles: roles,
            setCurrentRole: setCurrentRole,
            currentRole : currentRole,
            createRole : createRole,
            updateRole: updateRole,
            deleteRole : deleteRole,

            entities : entities,
            entitiesTreeNodes : entitiesTreeNodes,
            listEntities : listEntities,
            listEntitiesTreeNodes : listEntitiesTreeNodes,
            getEntitiesByRole : getEntitiesByRole,
            addEntitiesToRole : addEntitiesToRole,
            entityTypes : entityTypes,
            listEntityTypes : listEntityTypes
        });

        return rolesService;

    });

});
