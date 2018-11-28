linker.controller('MainController', ['$rootScope','$scope','$location','logoutService','$window','webService',function($rootScope,$scope,$location,logoutService,$window,webService) {
	
	var getdata = function() {
	if (sessionStorage.userType == "admin") {
		$scope.currentUser = {
	  			"name" : sessionStorage.userName,
	  	        "type" : sessionStorage.userType,
	  	        "agentName":sessionStorage.agentName,
	  	        "enterNameshow":sessionStorage.enterNameshow,
	  	        
	  	};
	}else{
		var url = "/op/agent/getAgentNameByAppid?appId="+sessionStorage.appId;
		webService.get_data(url).then(function(data) {
			$scope.currentUser = {
			  			"name" : sessionStorage.userName,
			  	        "type" : sessionStorage.userType,
			  	        "agentName":data.data,
			  	        "enterNameshow":sessionStorage.enterNameshow,
			  	        
			  	};
			},
			function(error) {
				$scope.currentUser = {
			  			"name" : sessionStorage.userName,
			  	        "type" : sessionStorage.userType,
			  	        "agentName":sessionStorage.agentName,
			  	        "enterNameshow":sessionStorage.enterNameshow,
			  	        
			  	};
			});
	}

	
	
	};
	
	getdata();
	


  	$scope.logout = function(){
  		logoutService.logout().then(function(response){
 	    	sessionStorage.name = "";
 	    	sessionStorage.type = "";
 	    	$window.location="/op-portal/login.html";
 	    },function(errorMessage){
 	       sessionStorage.name = "";
 	       sessionStorage.type = "";
 	       $window.location="/op-portal/login.html";
 	       /*layer.alert('退出失败', {    	 
 	    	  icon: 2
 	    	});*/
 	    });
  	};
  	getdata();
}]);