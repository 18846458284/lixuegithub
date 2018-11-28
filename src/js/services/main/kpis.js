function kpiResource($http, $q) {
	var getKpis = function(conditions) {
		var url = "/op/kpi/getKpi";
		var params = {
			"userName": conditions.userName,
			"startDate": conditions.startDate,
			"endDate": conditions.endDate,
			"customerOrderId": conditions.customerOrderId,
			"page": conditions.page,
			"num": conditions.num,
			"phoneNo": conditions.phoneNo,
			"kpiType": conditions.kpiType,
		};
		var request = {
			url: url,
			params: params
		};

		var deferred = $q.defer();
		$http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	return {
		"getKpis": getKpis,
	}
}
linker.factory('kpiService', ['$http', '$q', kpiResource]);