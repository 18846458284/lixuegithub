function depositService(http, q) {
	var checkAgent = function() {
		$('#agent').empty();
		var agentname = $('#deposit_agent').val();
		if (!agentname) {
			$('#agent').append("请选择代理商");
			$('#agent').show();
			return false;
		}
		return true;
	}
	var checkrechargeAmount = function() {
		$('#info').empty();
		var amount = $('#amount').val();
		//金额为空时
		if (amount.trim().length == 0) {
			$('#info').append("预存金额不能为空");
			$('#info').show();
			return false;
		}
		//金额为数字时，分为整数和小数两种情况。
		if (!isNaN(amount)) {
			var dot = amount.indexOf(".");
			//小数
			if (dot != -1) {
				var dotCnt = amount.substring(dot + 1, amount.length);
				var mm=amount.split(".")[0];
				if (mm > 9999999) {
					$('#info').append("金额不大于10000000");
					$('#info').show();
					return false;
				}
				//超过两位小数的数
				if (dotCnt.length > 2) {
					$('#info').append("小数位已超过两位");
					$('#info').show();
					return false;
				}
				//两位小数以内的数
				else {
					$('#info').hide();
					return true;
				}
			} else {
				if (amount > 10000000) {
					$('#info').append("金额不大于10000000");
					$('#info').show();
					return false;
				} else {
					$('#info').hide();
					return true;
				}
			}
		}
		//金额不是数字时
		else {
			$('#info').append("数字不合法");
			$('#info').show();
			return false;
		}

	};

	var getAgents = function() {
		var deferred = q.defer();
		var url = "/op/agent/getAgents";
		var request = {
			"url": url
		}
		http(request).success(function(response) {
			deferred.resolve(response);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	var deposit = function(conditions) {
		var deferred = q.defer();
		var url = "/op/deposit/deposit";
		var data = {
			"account": conditions.rechargeAmount * 100,
			"orderNo": conditions.rechargeMessage,
			"appId": conditions.appid,
		}
		var request = {
			"url": url,
			"dataType": "json",
			"method": "POST",
			"data": data
		}
		http(request).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	};

	return {
		"checkAgent": checkAgent,
		"checkrechargeAmount": checkrechargeAmount,
		"deposit": deposit,
		"getAgents": getAgents
	};

}
linker.factory('depositService', ['$http', '$q', depositService]);