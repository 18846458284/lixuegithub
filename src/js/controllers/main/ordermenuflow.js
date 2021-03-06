linker.controller('OrdermenuFlowController', ['$scope', '$window', '$state', '$location', 'ordersService', 'responseService', 'webService',
	function($scope, $window, $state, $location, ordersService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		$scope.orderBy = "createdTime";
		$scope.orderByValue = "-1";
		$scope.timeStamp = new Date().getTime();
		$scope.appId = _.isUndefined($state.params.byAppId) ? "" : $state.params.byAppId;
		$scope.mo = _.isUndefined($state.params.byMO) ? "" : $state.params.byMO;
		$scope.province = _.isUndefined($state.params.byProvince) ? "" : $state.params.byProvince;
		$scope.status = _.isUndefined($state.params.byStatus) ? "" : $state.params.byStatus;
		$scope.fromDate = _.isUndefined($state.params.byFromDate) ? "" : $state.params.byFromDate;
		$scope.toDate = _.isUndefined($state.params.byToDate) ? "" : $state.params.byToDate;
		$scope.customerOrderId = _.isUndefined($state.params.byCustomerOrderId) ? "" : $state.params.byCustomerOrderId;
		$scope.phoneNo = _.isUndefined($state.params.byphoneNo) ? "" : $state.params.byphoneNo;
		$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;
		$scope.resourceId = _.isUndefined($state.params.byresourceId) ? "" : $state.params.byresourceId;

		webService.get_province().then(function(data) {
				$scope.SelectProvince = data;
			},
			function(error) {
				responseService.errorResponse("读取省份失败");
			});

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
				webService.get_data("/op/agent/getAgents").then(function(data) {
						$scope.list = data.data;
					},
					function(error) {
						responseService.errorResponse("读取代理商失败");
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
				layer.alert('输入手机号', {
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
			if (checkDate() && checkPhone()) {
				ordersService.getOrders({
					appId: $scope.appId,
					mo: $scope.mo,
					province: $scope.province,
					status: $scope.status,
					fromDate: $scope.fromDate,
					toDate: $scope.toDate,
					customerOrderId: $scope.customerOrderId,
					page: $scope.page,
					num: $scope.num,
					phoneNo: $scope.phoneNo,
					spec: $scope.spec,
					resourceId: $scope.resourceId,
					orderBy: $scope.orderBy + ":" + $scope.orderByValue,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.orders = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取订单信息失败");
				});
			}

		};
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
		var checkSpec = function() {
			var filterNum = /^[1-9]\d*$/;
			var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
			if (filterUnit.test($scope.spec) || filterNum.test($scope.spec) || !$scope.spec || $scope.spec == "*") {
				return true;
			} else {
				layer.alert('请输入正确规格，单位M或G(大小写都可),或者任意规格*', {
					icon: 0
				});
				$scope.spec="";
				return false
			}
		}
		$scope.filterOrder = function() {
			if (check() && checkName() && checkDate() && checkPhone() && checkSpec()) {
				$scope.timeStamp = new Date().getTime();
				$location.path("/admin/ordermenuflow/" + $scope.appId + "/" + $scope.mo + "/" + $scope.province + "/" + $scope.status + "/" + document.getElementById("fromDate").value + "/" + document.getElementById("toDate").value + "/" + $scope.customerOrderId + "/" + $scope.phoneNo + "/" + $scope.spec + "/" + $scope.resourceId + "/" + $scope.timeStamp);
			}
		};

		$scope.exportOrders = function() {
			if (check() && checkName() && checkDate() && checkPhone() && checkSpec()){
				$scope.filterOrder();
				$window.location = "/op/order/order/export?resourceId=" + $scope.resourceId + "&appId=" + $scope.appId + "&mo=" + $scope.mo + "&province=" + $scope.province +
				"&status=" + $scope.status + "&fromDate=" + document.getElementById("fromDate").value +
				"&toDate=" + document.getElementById("toDate").value + "&customerOrderId=" + $scope.customerOrderId + "&phoneNo=" + $scope.phoneNo + "&spec=" + $scope.spec;
			}
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
			$scope.currentPage = 1;
			$scope.getPagesAndRecords();
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
		$scope.service = function(data) {
			$scope.add_service = true;
			$scope.passed_data = data;
			$scope.name = "flow";
		};
		$scope.callbackCustomer = function(data) {
			layer.confirm('确认给商户推送结果吗?', {icon: 3, title:'提示'}, function(index){
				var indexLoad = layer.load(2, {time: 16*1000});
				webService.get_data("/callbackCustomerService?id=" +data.orderId).then(function(data) {
					layer.close(indexLoad);
					layer.close(index);
					layer.alert('操作成功', {
						icon: 1
					});
				},
				function(error) {
					layer.close(indexLoad);
					layer.close(index);
					responseService.errorResponse("操作失败。" + error);
				});
			    
			});
		};
		initial();

	}
]);