function mifiResource($http, $q) {
	var getDatas = function(conditions) {
		var url = "/mifi/admin/v2/endusersession/query";
		var params = {
			"mifiNo": conditions.mifiNo,
			"mifiPhoneNo": conditions.mifiPhoneNo,
			"groupName": conditions.groupName,
			"startTime": conditions.startTime,
			"endTime": conditions.endTime,
			"pageCount": conditions.num,
			"pageNo": conditions.page,
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
	var editbatchmifires = function(conditions) {
		var deferred = $q.defer();
		var params = {
			"ids": conditions.ids,
			"cardType": conditions.cardType,
			"state": conditions.activeState,
		}
		var url = "/mifi/admin/v2/mificard/cardtypestate/batchedit"
		var request = {
			url: url,
			params: params
		}
		$http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}
	var getMifiRes = function(conditions) {
		var url = "/mifi/admin/v2/mificard/query";
		var params = {
			"mifiNo": conditions.mifiNo,
			"mifiPhoneNo": conditions.mifiPhoneNo,
			"cardType": conditions.cardType,
			"province": conditions.province,
			"activeState": conditions.activeState,
			"pageCount": conditions.num,
			"pageNo": conditions.page,
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
	var addMifiRes = function(conditions) {
		var url = "/mifi/admin/v2/mificard/add";
		var data = {
			"mifiPhoneNo": conditions.mifiPhoneNo,
			"mo": conditions.moType,
			"province": conditions.province,
			"groupName": conditions.groupName,
			"cardType": conditions.cardType,
			"activeState": conditions.activeState,
			"concurrency": conditions.concurrency,
			"imsi": conditions.imsi,
		};
		var request = {
			url: url,
			method:'POST',
			data: data
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
		"getDatas": getDatas,
		"editbatchmifires": editbatchmifires,
		"getMifiRes":getMifiRes,
		"addMifiRes":addMifiRes
	}
}
linker.factory('mifiUserInfoService', ['$http', '$q', mifiResource]);