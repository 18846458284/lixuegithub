login.controller('LoginController', ['$scope', 'loginService','$http',
	function($scope, loginService,$http) {
		$scope._checkEmail = function(event, target) {
			return loginService.checkEmail(event, target);
		};
		$scope._checkPasswd = function(event, target) {
			return loginService.checkPasswd(event, target);
		};
		$scope._checkVerifycode = function(event, target) {
			return loginService.checkVerifycode(event, target);
		};
		$scope.changeone = function() {
			$scope.verifyCode = '/user/noLogin/verifyCode?t=' + Date.now();
		};

		$scope.loginEmail = "";
		$scope.loginPassword = "";
		$scope.verifycode = "";
		$scope.resetEmail = "";
		$scope.verifyCode = '/user/noLogin/verifyCode?t=' + Date.now();

		$scope.doLogin = function() {
			var emailPassed = $scope._checkEmail(null, $("#loginUser"));
			var pwdPassed = $scope._checkPasswd(null, $("#loginPwd"));
			var codePassed = $scope._checkVerifycode(null, $("#loginCode"));
			if (emailPassed && pwdPassed && codePassed) {
				var data = {
					"username": $scope.loginEmail,
					"password": md5($scope.loginPassword),
					"verifycode": $scope.verifycode
				};
				loginService.doLogin(data);
			} else {
				return false;
			}
		};
		$scope.doApplyReset = function() {
			var emailPassed = $scope._checkEmail(null, $("#resetLinkEmail"));
			if (emailPassed) {
				var email = $("#resetLinkEmail").val();
				loginService.doResetPasswd(email);
			} else {
				return false;
			}
		};
	}
]);