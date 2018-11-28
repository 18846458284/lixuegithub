function channelQualityResource($http, $q) {
	var getChannelQuality = function(conditions) {
		var url = "/op/report/getChannelQuality";
		var params = {
			"mo": conditions.mo,
			"province": conditions.province,
			"startDate": conditions.fromDate,
			"endDate": conditions.toDate,
			"page": conditions.page,
			"num": conditions.num,
			"resourceId": conditions.resourceId,
			"bizType":conditions.bizType,
			"timeStamp": conditions.timeStamp,
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
		"getChannelQuality": getChannelQuality,
	}
}
linker.factory('channelQualityService', ['$http', '$q', channelQualityResource]);