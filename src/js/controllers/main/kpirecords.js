linker.controller('KpiRecordsController', ['$scope', '$window', '$state', '$location', 'kpiService', 'responseService', 'webService',
	function($scope, $window, $state, $location, kpiService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		//$scope.orderBy = "createdTime";
		//$scope.orderByValue = "-1";
		$scope.timeStamp = new Date().getTime();
		$scope.userName = _.isUndefined($state.params.byUserName) ? "" : $state.params.byUserName;
		$scope.phoneNo = _.isUndefined($state.params.byPhoneNo) ? "" : $state.params.byPhoneNo;
		$scope.customerOrderId = _.isUndefined($state.params.byCustomerOrderId) ? "" : $state.params.byCustomerOrderId;
		$scope.startDate = _.isUndefined($state.params.byStartDate) ? "" : $state.params.byStartDate;
		$scope.endDate = _.isUndefined($state.params.byEndDate) ? "" : $state.params.byEndDate;
		$scope.kpiType = _.isUndefined($state.params.byKpiType) ? "" : $state.params.byKpiType;

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
				webService.get_data("/op/kpi/getKpiType").then(function(data) {
						$scope.list = data.data;
					},
					function(error) {
						responseService.errorResponse("读取操作类型失败");
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
		var checkPhone = function() {
			var phone = $scope.phoneNo;
			if (phone != "" && isNaN(phone)) {
				layer.alert('输入正确手机号', {
					icon: 0
				});
				$scope.phoneNo = "";
				return false;
			} else if (phone != "" && phone.length > 16) {
				layer.alert('输入1-16位手机号', {
					icon: 0
				});
				$scope.phoneNo = "";
				return false;
			} else
				return true;
		}
		var checkDate = function() {
			var d1 = new Date($scope.startDate.replace(/\-/g, "\/"));
			var d2 = new Date($scope.endDate.replace(/\-/g, "\/"));
			if ($scope.startDate != "" && $scope.endDate != "" && d1 > d2) {
				layer.alert('结束时间不能小于开始时间', {
					icon: 0 //failure icon; icon 1: success icon; icon 0: alert icon;
				});
				document.getElementById("startDate").value = "";
				document.getElementById("endDate").value = "";
				return true;
			} else {
				return true;
			}
		};
		var checkName = function() {
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test($scope.userName)&&($scope.userName!="")) {
			layer.alert('请输入正确的用户名格式', {
					icon: 0
				});
				$scope.userName="";
				return false;
			} else {
				return true;
			}
		}
		var check = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.customerOrderId)&&($scope.customerOrderId!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.customerOrderId="";
				return false;
			} else {
				return true;
			}
		}
		$scope.getPagesAndRecords = function() {
			if (checkDate() && checkPhone()) {
				kpiService.getKpis({
					userName: $scope.userName,
					phoneNo: $scope.phoneNo,
					customerOrderId: $scope.customerOrderId,
					startDate: $scope.startDate,
					endDate: $scope.endDate,
					kpiType: $scope.kpiType,
					page: $scope.page,
					num: $scope.num,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.kpis = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取KPI记录失败");
				});
			}

		};
		$scope.filterKpi = function() {
			if (checkDate() && checkPhone()&&check()&&checkName()) {
				$scope.timeStamp = new Date().getTime();
				$location.path("/admin/kpirecords/" + $scope.userName + "/" + $scope.phoneNo + "/" + $scope.customerOrderId + "/" + document.getElementById("startDate").value + "/" + document.getElementById("endDate").value + "/" + $scope.kpiType + "/" + $scope.timeStamp);
			}
		};
		$scope.exportKpi = function() {
			if (checkDate() && checkPhone()&&check()&&checkName()) {
				$scope.filterKpi();
				$window.location = "/op/kpi/getKpi_export?userName=" + $scope.userName + "&phoneNo=" + $scope.phoneNo + "&customerOrderId=" + $scope.customerOrderId + "&startDate=" + document.getElementById("startDate").value +
				"&endDate=" + document.getElementById("endDate").value + "&kpiType=" + $scope.kpiType;
				
			}
		};

		//		$scope.makeOrder = function(type, direction) {
		//			if ($scope.orderBy == type) {
		//				if (direction == "up") {
		//					$scope.orderByValue = "1";
		//				} else {
		//					$scope.orderByValue = "-1";
		//				}
		//			} else {
		//				$scope.orderBy = type;
		//				if (direction == "up") {
		//					$scope.orderByValue = "1";
		//				} else {
		//					$scope.orderByValue = "-1";
		//				}
		//			}
		//			$scope.currentPage = 1;
		//			$scope.getPagesAndRecords();
		//		};

		//		$scope.getupSortClass = function(type) {
		//			var spanClass = "no-sort-up";
		//			if ($scope.orderBy == type) {
		//				if ($scope.orderByValue == "-1") {
		//					spanClass = "no-sort-up";
		//				} else {
		//					spanClass = "sort-up";
		//				}
		//			}
		//			return spanClass;
		//		}
		//		$scope.getdownSortClass = function(type) {
		//			var spanClass = "no-sort-down";
		//			if ($scope.orderBy == type) {
		//				if ($scope.orderByValue == "-1") {
		//					spanClass = "sort-down";
		//				} else {
		//					spanClass = "no-sort-down";
		//				}
		//			}
		//			return spanClass;
		//		}
		//		$scope.service = function(data) {
		//			$scope.add_service = true;
		//			$scope.passed_data = data;
		//			$scope.name="flow";
		//		};	
		initial();

	}
]);