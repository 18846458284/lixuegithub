linker.controller('LeftcontentadminController', function($scope, $http, $location, $state, $rootScope, menuService) {

	menuService.getMenu(sessionStorage.roleId)
		.then(function(response) {
			$scope.navigators = response.data;
			forRefresh();
		}, function(errorMessage) {
			responseService.errorResponse("读取加款信息失败");
		});

	$scope.selectthis = function(Ite) {
		Ite.value = true;
		var i = $scope.navigators.length;
		for (m = 0; m < i; m++) {
			if ($scope.navigators[m].menuName != Ite.menuName) {
				$scope.navigators[m].value = false;
			}
		};
	};
	$scope.subSelectthis = function(subitem) {
		var i = $scope.navigators.length;
		for (m = 0; m < i; m++) {
			var j = $scope.navigators[m].menueSon.length;
			for (n = 0; n < j; n++) {
				u = $location.path();
				if (u != "") {
					$scope.navigators[m].menueSon[n].ngclass = false;
				}
			}
		}
		subitem.ngclass = true;
		if (subitem.menuName == "监控视图") {
			subitem.ngclass = false;
			window.location.reload();
		}
	};

	function forRefresh() {
		var path = $location.path();
		var i = $scope.navigators.length;
		for (m = 0; m < i; m++) {
			var j = $scope.navigators[m].menueSon.length;
			for (n = 0; n < j; n++) {

				if (path != "") {
					if (path.split('/')[2] == $scope.navigators[m].menueSon[n].menuImage) {
						$scope.navigators[m].value = true;
						$scope.navigators[m].menueSon[n].ngclass = true;
						break;
					} else {
						$scope.navigators[m].value = false;
						$scope.navigators[m].menueSon[n].ngclass = false;
					}
				}
			}
		}
	};
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		var path = toState.name;
		_.each($scope.navigators, function(item) {
			if (path != "") {
				if (path != item.sref) {
					item.ngclass = "";
				} else {
					item.ngclass = "active";
				}
			}
		});
		$('.list-group-item').blur();
	});
});
linker.controller('LeftcontentappController', function($scope, $location, $rootScope) {
	$scope.navigators = [{
		"name": "流量订单",
		"image": "ordersflow",
		"sref": "app.ordersflow",
		"ngclass": "active",
	}, {
		"name": "话费订单",
		"image": "ordersvoice",
		"sref": "app.ordersvoice",
		"ngclass": "",
	}, {
		"name": "财务中心",
		"image": "finance",
		"sref": "app.finance",
		"ngclass": "",
	}, {
		"name": "流量充值",
		"image": "manualflow",
		"sref": "app.manualflow",
		"ngclass": "",

	}, {
		"name": "话费充值",
		"image": "manualvoice",
		"sref": "app.manualvoice",
		"ngclass": "",
	}, {
		"name": "余额预警",
		"image": "appEmail",
		"sref": "app.email",
		"ngclass": "",
	}, ];

	$scope.selectthis = function(Ite) {
		_.each($scope.navigators, function(item) {
			if (item.name != Ite.name) {
				item.ngclass = "";
			} else {
				item.ngclass = "active";
			}
		});
		Ite.value = true;
		var i = $scope.navigators.length;
		for (m = 0; m < i; m++) {
			if ($scope.navigators[m].name != Ite.name) {
				$scope.navigators[m].value = false;
			}
		};

	};
	$scope.subSelectthis = function(name) {
		_.each($scope.navigators, function(item) {
			if (item.sec.name != name) {
				item.sec.ngclass = "";
			} else {
				item.sec.ngclass = "active";
			}
		})

	};

	$scope.setValue = function(Value) {
		Value.sec.value = true;
	};

	function forRefresh() {
		var path = $location.path();
		_.each($scope.navigators, function(item) {
			if (path != "") {
				if (path.split('/')[2] != item.image) {
					item.ngclass = "";
				} else {
					item.ngclass = "active";
				}
			}
		})
	}
	forRefresh();
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		var path = toState.name;
		_.each($scope.navigators, function(item) {
			if (path != "") {
				if (path != item.sref) {
					item.ngclass = "";
				} else {
					item.ngclass = "active";
				}
			}
		});
		$('.list-group-item').blur();
	});
})