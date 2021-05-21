angular.module('libroEditar')
    .component('libroEditar', {
        templateUrl: 'core/libros/libro-editar/libro-editar.template.html',
        controller: function ($http, $rootScope, $routeParams, $scope) {
            $scope.libro = {};
            // Conseguir la información del libro y las listas de autores y géneros.
            $http.get(
                $rootScope.env.apiServer + "libroEditar",
                { params: { id: $routeParams.id } })
                .then(function (response) {
                    $scope.libro = response.data.libro;
                    $scope.autores = response.data.autores;
                    $scope.generos = response.data.generos;
                });

            // Editar el libro seleccionado.
            $scope.libroEditar = function () {
                // Crear y armar nuevo formulario (no usamos el formulario ya existente
                // porque los campos autor y genero no conservan el formato adecuado).
                var libroForm = new FormData();
                libroForm.append('id', $scope.libro.id);
                libroForm.append('version', $scope.libro.__v + 1);
                libroForm.append('titulo', $scope.libro.titulo);
                libroForm.append('descrip', $scope.libro.descrip);
                libroForm.append('autor', $scope.libro.autor);
                libroForm.append('edicion', $scope.libro.edicion);
                libroForm.append('ano', $scope.libro.ano);
                libroForm.append('genero', $scope.libro.genero);
                libroForm.append('isbn', $scope.libro.isbn);
                libroForm.append('imagen', $scope.libro.imagen);
                // Limitado a un solo archivo.
                // No se pueden seleccionar los archivos de forma dinámica en AngularJS.
                libroForm.append('imagen', document.getElementById("imagen").files[0]);

                // Configurar petición HTTP y enviar formulario.
                if ($scope.libroForm.$valid) {
                    $http.post(
                        $rootScope.env.apiServer + "libroEditar", libroForm, {
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
                if ($scope.libro.imagen) {
                    // Usamos el parámetro de version para evitar problemas con el caché de imágenes.
                    return $rootScope.env.imgServer + "libros/" + $scope.libro.imagen + "?v" + $scope.libro.__v;
                }
            }
        }
    });