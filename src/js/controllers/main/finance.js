linker.controller('FinanceController', ['$scope', '$window', '$state', '$location', 'financeService', 'responseService',
	function($scope, $window, $state, $location, financeService, responseService) {
		$scope.trades = [];
		$scope.orderId = _.isUndefined($state.params.byorderId) ? "" : $state.params.byorderId;
		$scope.fromDate = _.isUndefined($state.params.byfromDate) ? "" : $state.params.byfromDate;
		$scope.toDate = _.isUndefined($state.params.bytoDate) ? "" : $state.params.bytoDate;
		$scope.byTranscationType = _.isUndefined($state.params.byTranscationType) ? "" : $state.params.byTranscationType;
		$scope.currentPage = 1;
		$scope.totalPage = 1;
		$scope.num = 5;
		$scope.timeStamp = new Date().getTime();
		$scope.filterTranscationType = $scope.byTranscationType;
		$scope.appId = sessionStorage.appId;

		$scope.orderBy = "createDate";
		$scope.orderByValue = "-1";
		
		$scope.makeOrder = function(type, direction) {
			if ($scope.orderBy == type) {
				if (direction == "up") {
					$scope.orderByValue = "1";
				} else {
					$scope.orderByValue = "-1";
				}
			} else {
				$scope.orderBy = type;
				if (direction == "up") {
					$scope.orderByValue = "1";
				} else {
					$scope.orderByValue = "-1";
				}
			}
			$scope.currentPage = 1;
			$scope.getCashFlow();
		};

		$scope.initDateComponent = function(param) {
			laydate({
				elem: '#' + param,
				format: 'YYYY-MM-DD hh:mm:ss',
				isclear: true,
				istoday: true,
				istime: true,
				issure: true,
				choose: function(date) {
					$scope[param] = date;
				}
			});
		};
		var checkDate = function() {
			var d1 = new Date(document.getElementById("fromDate").value.replace(/\-/g, "\/"));
			var d2 = new Date(document.getElementById("toDate").value.replace(/\-/g, "\/"));
			if (document.getElementById("fromDate").value != "" && document.getElementById("toDate").value != "" && d1 > d2) {
				layer.alert('结束时间不能小于开始时间', {
					icon: 0 //failure icon; icon 1: success icon; icon 0: alert icon;
				});
				document.getElementById("fromDate").value = "";
				document.getElementById("toDate").value = "";
				$scope.fromDate = "";
				$scope.toDate = "";
				return false;
			} else {
				return true;
			}
		};
		$scope.getupSortClass = function(type) {
			var spanClass = "no-sort-up";
			if ($scope.orderBy == type) {
				if ($scope.orderByValue == "-1") {
					spanClass = "no-sort-up";
				} else {
					spanClass = "sort-up";
				}
			}
			return spanClass;
		}
		$scope.getdownSortClass = function(type) {
				var spanClass = "no-sort-down";
				if ($scope.orderBy == type) {
					if ($scope.orderByValue == "-1") {
						spanClass = "sort-down";
					} else {
						spanClass = "no-sort-down";
					}
				}
				return spanClass;
			}
			//order end

		$scope.getCashFlow = function() {
			if (checkDate()) {
				var queryParm = {
					"appId": $scope.appId,
					"byorderId": $scope.orderId,
					"byfromDate": $scope.fromDate,
					"bytoDate": $scope.toDate,
					"byTranscationType": $scope.filterTranscationType,
					"currentPage": $scope.currentPage,
					"num": $scope.num,
					"orderBy": $scope.orderBy + ":" + $scope.orderByValue
				}

				financeService.getTrades(queryParm).then(function(data) {
						if (responseService.successResponse(data)) {
							$scope.totalPage = data.pagedListDTO.totalPage;
							$scope.trades = data.pagedListDTO.records;
							$scope.total = data.pagedListDTO.total;
							if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
								$scope.page = $scope.totalPage;
								$scope.getCashFlow();
								return;
							}
						}
					},
					function(errorMessage) {
						responseService.errorResponse("读取资金流水失败");
					});
			}
		};
		var check = function() {
			var filter =   /^[a-zA-Z0-9-\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.orderId)&&($scope.orderId!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.orderId="";
				return  false;
			} else {
				return  true;
			}
		}

		$scope.filterCashFlow = function() {
			$scope.timeStamp = new Date().getTime();
			if (checkDate() && check()) {
				$scope.filterTranscationType = $scope.byTranscationType;
				var locationhead = $state.current.name.split('.');
				if (locationhead[0] == "admin") {
					$scope.getCashFlow();
					$location.path("/admin/agent/finance/" + $scope.orderId + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.filterTranscationType + "/" + $scope.timeStamp);
				} else if (locationhead[0] == "app") {
					$scope.getCashFlow();
					$location.path("/app/finance/"  + $scope.orderId + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.filterTranscationType + "/" + $scope.timeStamp);
				}
			}
		};

		$scope.downloadCashFlow = function() {
			if (checkDate() && check()) {
				$scope.filterCashFlow();
				var queryParm = {
						"appId": $scope.appId,
						"byorderId": $scope.orderId,
						"byfromDate": document.getElementById("fromDate").value,
						"bytoDate": document.getElementById("toDate").value,
						"byTranscationType": $scope.filterTranscationType
				}
				$window.location = "/op/cashFlow/cash_flow/export?appId=" + queryParm.appId + "&orderId=" + queryParm.byorderId + "&fromDate=" + queryParm.byfromDate + "&toDate=" + queryParm.bytoDate + "&transactionType=" + queryParm.byTranscationType;
			}
		};

		function _getAccountInfo() {
			var queryParm = {
				"appId": $scope.appId,
			}
			financeService.getAccountInfo(queryParm).then(function(data) {
					if (responseService.successResponse(data)) {
						var restAmount = data.data.restAmount;
						var usedAmount = data.data.usedAmount;
						restAmount = restAmount.toFixed(3);
						usedAmount = Math.abs(usedAmount).toFixed(3);
						var cmcc = data.data.cmcc;
						var chinaNet = data.data.chinaNet;
						var chinaUnicom = data.data.chinaUnicom;
						cmcc = (cmcc / 100).toFixed(2);
						chinaNet = (chinaNet / 100).toFixed(2);
						chinaUnicom = (chinaUnicom / 100).toFixed(2);

						$scope.accountinfo = {
							"restAmount": restAmount,
							"usedAmount": usedAmount,
							"cmcc": cmcc,
							"chinaNet": chinaNet,
							"chinaUnicom": chinaUnicom
						};
					}
				},
				function(errorMessage) {
					responseService.errorResponse("读取账户信息失败");
				});
		};
		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('currentPage', function() {
					$scope.getCashFlow();
				});
				$scope.$watch('num', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getCashFlow();
				});
				_getAccountInfo();
			}
		};
		initial();
	}
]);