linker.controller('AccountController', ['$scope', '$http', 'checkEmail', 'responseService',
	function($scope, $http, checkEmail, responseService) {
		responseService.checkSession();
		$scope.false_reason = true;
		$scope.show_change = true;
		$scope.back = false;
		$scope.show = false;
		$scope.pass = function() {
			if ($scope.emailPassed) {
				$http({
					url: '/user/noLogin/reset?email=' + $scope.resetEmail,
					method: 'GET'
				}).success(function(response) {
					if (responseService.successResponse(response)) {
						layer.alert('提交成功，请检查邮箱', {
							icon: 1
						});
						$scope.resetEmail = "";
					}
				}).error(function(error) {
						responseService.errorResponse('请检查网络');
					}

				);
			} else return false;
		};

		$scope._checkEmail = function(event) {

			$scope.emailPassed = checkEmail(event);
		};
		$scope.take_back = function() {
			$scope.show_change = !$scope.show_change;

		}

	}
]);