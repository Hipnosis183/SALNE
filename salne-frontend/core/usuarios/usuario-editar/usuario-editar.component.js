angular.module('usuarioEditar')
    .component('usuarioEditar', {
        templateUrl: 'core/usuarios/usuario-editar/usuario-editar.template.html',
        controller: function ($http, $rootScope, $routeParams, $scope) {
            $scope.usuario = {};
            // Conseguir la información del usuario.
            $http.get(
                $rootScope.env.apiServer + "usuario",
                { params: { id: $routeParams.id } })
                .then(function (response) { $scope.usuario = response.data; });

            // Editar el usuario actual.
            $scope.usuarioEditar = function () {
                // Crear y armar nuevo formulario.
                var usuarioForm = new FormData();
                usuarioForm.append('id', $scope.usuario.id);
                usuarioForm.append('version', $scope.usuario.__v + 1);
                usuarioForm.append('nombre', $scope.usuario.nombre);
                usuarioForm.append('password', $scope.usuario.password);
                usuarioForm.append('email', $scope.usuario.email);
                usuarioForm.append('admin', true);
                usuarioForm.append('imagen', $scope.usuario.imagen);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                usuarioForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.usuarioForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "usuarioEditar", usuarioForm, {
                            // Atributos necesarios para el envio de archivos.
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                        .then(function (response) {
                            if (response.status === 200) { $rootScope.goBack(); }
                            else { $rootScope.showError(); }
                        });
                }
            }

            // Buscar imagen en el servidor.
            $scope.getImage = function () {
                if ($scope.usuario.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "usuarios/" + $scope.usuario.imagen + "?v" + $scope.usuario.__v;
                }
            }
        }
    });