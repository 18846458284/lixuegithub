var all = angular.module('all', []);
all.factory('check', function() {
	return function(event, type) {
		switch (type) {
			case 'password':
				var password = $(event.currentTarget).val();
				var num = password.length;
				var reg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[.\<,\>\/\?;:'"!@#$%^&\[\]\{\}\\\|\+\=\-\_\(\)\*\`\~])|(?=.*?[A-Za-z])(?=.*?[.\<,\>\/\?;:'"!@#$%^&\[\]\{\}\\\|\+\=\-\_\(\)\*\`\~]))[\dA-Za-z.\<,\>\/\?;:'"!@#$%^&\[\]\{\}\\\|\+\=\-\_\(\)\*\`\~]+$/
				if (num < 6 || num > 20) {
					$(event.currentTarget).next().text('密码必须不小于于6且不能超过20位');
					return true
				} else if (/\s/.test(password)) {
					$(event.currentTarget).next().text('密码有空格');
					return true;
				} else if (!reg.test(password)) {
					$(event.currentTarget).next().text('密码只含数字或字母或符号');
					return true;
				}else{
					return false;
				}
				break;
			case 'config':
				if ($(event.currentTarget).val() == $(event.currentTarget).parent().firstChild().val()) {
					return true
				} else return false;
		}
	}
});
all.controller('password_reset', function($scope, $window, $http, check) {
	$scope.data = new Array();
	$scope.check = false;
	$scope.pass_passwd = function() {
		if (typeof($scope.passwd) == "undefined" || $scope.passwd.length == 0) {
			$scope.check = true;
		} else $scope.check = false;
		if (!$scope.data[0] && !$scope.data[1] && typeof($scope.passwd) != "undefined"&&typeof($scope.config) != "undefined") {
			var hash = md5($scope.passwd);
			$http.get("/user/noLogin/reset_newpasswd?passwd=" + hash).success(function(response) {
				if (response.reply == 1) {
					layer.alert('修改密码成功', {
						icon: 1
					}, function() {
						$window.location = "/op-portal/login.html"
					});
				} else {
					layer.alert(response.replyDesc, {
						icon: 2
					});
				}
			}).error(function(err) {
				layer.alert('请检查网络', {
					icon: 2
				});
			});
		}else{
			if($scope.passwd != $scope.config)
				$scope.data[1]=true;
			else
				$scope.data[1]=false;
		}
	};
	$scope._check = function(event, type) {
		switch (type) {
			case "password":
				$scope.data[0] = check(event, type);
				if (typeof($scope.passwd) == "undefined" || $scope.passwd.length == 0) {
					$scope.check = true;
					$scope.data[0] = false;
				} else $scope.check = false;
				break;
			case "config":
				if ($(event.currentTarget).val() == $scope.passwd) {
					$scope.data[1] = false;
				} else $scope.data[1] = true;
				break;
			default:
				;
				break;
		}
	};
});