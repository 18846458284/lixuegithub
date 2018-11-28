function orderResource($http, $q) {
	var getMaeForCompare = function(conditions) {
		var url = "/op/audit/forCompareList";
		var params = {
			"channelId": conditions.channelId,
			"startDate": conditions.startDate,
			"endDate": conditions.endDate,
			"page": conditions.page,
			"num": conditions.num,
			"state": conditions.state,
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
		"getMaeForCompare": getMaeForCompare,
	}
}
linker.factory('maeForCompareService', ['$http', '$q', orderResource]);