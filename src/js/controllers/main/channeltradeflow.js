linker.controller('ChannelTradeFlowController', ['$scope', '$window', '$state', '$location', 'channelTradeService', 'responseService', 'webService',
	function($scope, $window, $state, $location, channelTradeService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		$scope.timeStamp = new Date().getTime();
		$scope.mo = _.isUndefined($state.params.byMO) ? "" : $state.params.byMO;
		$scope.province = _.isUndefined($state.params.byProvince) ? "" : $state.params.byProvince;
		$scope.fromDate = _.isUndefined($state.params.byFromDate) ? "" : $state.params.byFromDate;
		$scope.toDate = _.isUndefined($state.params.byToDate) ? "" : $state.params.byToDate;
		$scope.resourceId = _.isUndefined($state.params.byresourceId) ? "" : $state.params.byresourceId;
		$scope.bizType = "flow";

		webService.get_province().then(function(data) {
				$scope.SelectProvince = data;
			},
			function(error) {
				responseService.errorResponse("读取省份失败");
			});
		var checkName = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.resourceId)&&($scope.resourceId!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.resourceId="";
				return false;
			} else {
				return true;
			}
		}
		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('page', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
				$scope.$watch('num', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
				$scope.getPagesAndRecords();
			}
		};

		$scope.initDateComponent = function(param) {
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
		$scope.getPagesAndRecords = function() {

			//  	$scope.page = _.isUndefined(arg) ? $scope.page : arg;
			if (checkDate()) {
				channelTradeService.getChannelTrade({
					mo: $scope.mo,
					province: $scope.province,
					fromDate: $scope.fromDate,
					toDate: $scope.toDate,
					page: $scope.page,
					num: $scope.num,
					resourceId: $scope.resourceId,
					bizType: $scope.bizType,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.datas = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取交易量统计信息失败");
				});
			}

		};
		$scope.filterChannelTrade = function() {
			if (checkDate()&&checkName()) {
				$scope.timeStamp = new Date().getTime();
				$location.path("/admin/channeltradeflow/" + $scope.mo + "/" + $scope.province + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.resourceId + "/" + $scope.bizType + "/" + $scope.timeStamp);
			}
		};

		$scope.exportchanneltrade = function() {
			if (checkDate()&&checkName()) {
				$scope.filterChannelTrade();
				$window.location = "/op/report/queryChannelTrade/export?mo=" + $scope.mo + "&province=" + $scope.province + "&resourceId=" + $scope.resourceId + "&startDate=" + document.getElementById("fromDate").value +
					"&endDate=" + document.getElementById("toDate").value + "&bizType=" + $scope.bizType;
			}
		};

		initial();

	}
]);