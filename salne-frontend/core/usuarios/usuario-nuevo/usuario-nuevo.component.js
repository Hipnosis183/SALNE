angular.module('usuarioNuevo')
    .component('usuarioNuevo', {
        templateUrl: 'core/usuarios/usuario-nuevo/usuario-nuevo.template.html',
        controller: function ($http, $rootScope, $scope) {
            $scope.usuario = {};
            // Crear un usuario nuevo con los datos ingresados.
            $scope.usuarioNuevo = function () {
                // Crear y armar nuevo formulario.
                var usuarioForm = new FormData();
                usuarioForm.append('nombre', $scope.usuario.nombre);
                usuarioForm.append('password', $scope.usuario.password);
                usuarioForm.append('email', $scope.usuario.email);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                usuarioForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.usuarioForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "usuarioNuevo", usuarioForm, {
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
        }
    });