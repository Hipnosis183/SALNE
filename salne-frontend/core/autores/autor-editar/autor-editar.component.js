angular.module('autorEditar')
    .component('autorEditar', {
        templateUrl: 'core/autores/autor-editar/autor-editar.template.html',
        controller: function ($http, $rootScope, $routeParams, $scope) {
            $scope.autor = {};
            // Conseguir la información del autor.
            $http.get(
                $rootScope.env.apiServer + "autor",
                { params: { id: $routeParams.id } })
                .then(function (response) { $scope.autor = response.data.autor; });

            // Editar el autor seleccionado.
            $scope.autorEditar = function () {
                // Crear y armar nuevo formulario.
                var autorForm = new FormData();
                autorForm.append('id', $scope.autor.id);
                autorForm.append('version', $scope.autor.__v + 1);
                autorForm.append('nombre', $scope.autor.nombre);
                autorForm.append('imagen', $scope.autor.imagen);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                autorForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.autorForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "autorEditar", autorForm, {
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
                if ($scope.autor.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "autores/" + $scope.autor.imagen + "?v" + $scope.autor.__v;
                }
            }
        }
    });