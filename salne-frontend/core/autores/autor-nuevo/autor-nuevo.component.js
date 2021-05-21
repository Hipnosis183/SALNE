angular.module('autorNuevo')
    .component('autorNuevo', {
        templateUrl: 'core/autores/autor-nuevo/autor-nuevo.template.html',
        controller: function ($http, $rootScope, $scope) {
            $scope.autor = {};
            // Crear un autor nuevo con los datos ingresados.
            $scope.autorNuevo = function () {
                // Crear y armar nuevo formulario.
                var autorForm = new FormData();
                autorForm.append('nombre', $scope.autor.nombre);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                autorForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.autorForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "autorNuevo", autorForm, {
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