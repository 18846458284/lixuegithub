function financeService(http, q) {
	var getTrades = function(queryParm) {
		var deferred = q.defer();
		var url = "/op/cashFlow/cash_flow?appId=" + queryParm.appId + "&orderId=" + queryParm.byorderId + "&fromDate=" + queryParm.byfromDate + "&toDate=" + queryParm.bytoDate + "&transactionType=" + queryParm.byTranscationType + "&page=" + queryParm.currentPage + "&num=" + queryParm.num + "&orderBy=" + queryParm.orderBy;
		var request = {
			"url": url,
			"dataType": "json",
			"method": "GET"
		}

		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	};

	var getAccountInfo = function(queryParm) {
		var deferred = q.defer();
		var url = "/op/account/accountinfo?appId=" + queryParm.appId;
		var request = {
			"url": url,
			"dataType": "json",
			"method": "GET"
		}

		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	};

	return {
		'getTrades': getTrades,
		'getAccountInfo': getAccountInfo
	}
}


linker.factory('financeService', ['$http', '$q', financeService]);