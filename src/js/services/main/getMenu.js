function menuService($http, $q) {
	var getMenu = function(data) {
		var deferred = $q.defer();
		var url = "/user/role/getMenuByRole?roleId="+data;
		var request = {
		    "url": url,
		    "dataType": "json",
		    "method": "GET"
		}
		$http(request).success(function(response){
			deferred.resolve(response);
		}).error(function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};

	return {
		"getMenu": getMenu,
	}
}
linker.factory('menuService', ['$http', '$q', menuService]);