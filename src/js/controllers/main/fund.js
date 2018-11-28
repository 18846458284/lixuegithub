linker.controller('FundController', ['$scope', '$window', '$state', '$location', 'fundService', 'responseService',
	function($scope, $window, $state, $location, fundService, responseService) {
		$scope.page = 1;
		$scope.num = 10;

		$scope.orderBy = "createDate";
		$scope.orderByValue = "-1";
		$scope.timeStamp = new Date().getTime();
		$scope.appId = _.isUndefined($state.params.byAppId) ? "" : $state.params.byAppId;
		$scope.fromDate = _.isUndefined($state.params.byFromDate) ? "" : $state.params.byFromDate;
		$scope.toDate = _.isUndefined($state.params.byToDate) ? "" : $state.params.byToDate;
		$scope.deposit_agent = "";
		responseService.checkSession();

		$scope.getAgents = function() {
			fundService.getAgents().then(function(response) {
				if (responseService.successResponse(response)) {
					$scope.agents = response.data;
				}
			}, function(errorMessage) {
				responseService.errorResponse("读取代理商信息失败");
			});
		};
		//getAgents()的执行要写在实现该方法的后面
		$scope.initDateComponent = function(param) {
			$scope[param] = "";
			laydate({
				elem: '#' + param,
				isclear: true,
				istoday: false,
				choose: function(date) {
					$scope[param] = date;
				}
			});
		};
			var checkDate = function() {
			var d1 = new Date($scope.fromDate.replace(/\-/g, "\/"));
			var d2 = new Date($scope.toDate.replace(/\-/g, "\/"));
			if ($scope.fromDate != "" && $scope.toDate != "" && d1 > d2) {
				layer.alert('结束时间不能小于开始时间', {
					icon: 0 //failure icon; icon 1: success icon; icon 0: alert icon;
				});
				document.getElementById("fromDate").value = "";
				document.getElementById("toDate").value = "";
				return true;
			} else {
				return true;
			}
		};
		$scope.getFunds = function() {
			if (checkDate()) {
				fundService.getFunds({
					appId: $scope.appId,
					fromDate: $scope.fromDate,
					toDate: $scope.toDate,
					page: $scope.page,
					num: $scope.num,
					orderBy: $scope.orderBy + ":" + $scope.orderByValue,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.funds = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
							$scope.page = $scope.totalPage;
							$scope.getFunds();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取加款信息失败");
				});
			}
		}
		$scope.filterFund = function() {
			$scope.timeStamp = new Date().getTime();
			if (checkDate()) {
				$location.path("/admin/fund/" + $scope.appId + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.timeStamp);
			}
		};
		$scope.exportFunds = function() {
			$scope.filterFund();
			$window.location = "/op/deposit/depositQuery/export?appId=" + $scope.appId + "&fromDate=" + document.getElementById("fromDate").value +
				"&toDate=" + document.getElementById("toDate").value;
		};
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
			$scope.page = 1;
			$scope.getFunds();
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
		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('page', function() {
					$scope.getFunds();
				});
				$scope.$watch('num', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getFunds();
				});
				$scope.getAgents();
			}
		};

		initial();
	}
])