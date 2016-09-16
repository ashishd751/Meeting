var myApp = angular.module('productApp', ['ngRoute', 'ngCookies'] );

var controllers = {};
var ProductController = function($scope,$http,$rootScope,$cookieStore,$location,$route) {
	
	
	$scope.my = {message:false};
	$scope.log = {msg: false};
	$scope.log = {msg2: false};
	$scope.my1 = {message1: false};
	$scope.log = {msg3: false};
	
	$scope.getUserId = function(uid){
		$rootScope.delId = uid;
	}
	
	$scope.getRoomId = function(rid,rname){
		$rootScope.roomId = rid;
		$rootScope.rName = rname;
	}
	
	$scope.myChange = function(){
		
		$scope.my = {message:false};
		//$scope.log = {msg:false};
		
	}
	
$scope.myChange1 = function(){
		
		$scope.log = {msg2:false};
		
	}

$scope.myChange2 = function(){
	
	$scope.log = {msg3:false};
	
}
	
	
	$scope.login = function() {
		
		email = $scope.username;
		password = $scope.password;
		
		
		   var atpos = email.indexOf("@");
		   var dotpos = email.lastIndexOf(".");
		    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		        //alert("Not a valid e-mail address");
		        $scope.log.msg2 = true;
		        return false;
		    }
		    
		    if(email.length == null || password.length == null){
		    	 $scope.log.msg3 = true;
			        return false;
		    }
		
		 $http({
	           method : 'POST',
	           url : 'http://10.20.14.83:9003/roommanagement/login',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9003/'
	           },
	           data : {
	                 email: email,
	                 password: password
	                 }
	    }).then(function successCallback(response) {
	    	   $rootScope.name = response.data.name;
	    	   $rootScope.auth = response.data.id;
	    	   $rootScope.rights = response.data.rights;
	    	   $rootScope.isLogged = "true";
	    	   //$rootScope.isUser = "true";
	    	   $cookieStore.put("name", $rootScope.name );
	    	   $cookieStore.put("authToken",$rootScope.auth);
	    	   $cookieStore.put("isLogged", $rootScope.isLogged);
	    	   $cookieStore.put("rights", $rootScope.rights);	    	   
	    	   $cookieStore.put("isUser", true);	        	
	    	   console.log( $rootScope.name+ " " + $rootScope.auth + " " +  $rootScope.isLogged + " " +  $rootScope.rights );
	    	   $scope.log.msg = false;
	    	   bootbox.dialog({
					  message: 'Login successful!',
					  onEscape: function() { console.log("Ecsape"); },
					  backdrop: true
					});
	    	   $location.path("/");
	    	   
	    	  
	         
	    }, function errorCallback(response) {
	    	$scope.log.msg = true;
		});
		
	}
	
	$scope.redirect = function(){
		if ($cookieStore.get("rights") == 0)
     	{
     	   	$location.path("/adminDashboard");
     	}
		else
 	   {
			$location.path("/userDashboard");
 	   }
	}
	
	$scope.logout = function(){
		$rootScope.isLogged = "false";  
		$cookieStore.put("isLogged", $rootScope.isLogged);
		$cookieStore.put("isUser", false);
		$cookieStore.remove("authToken");
		$cookieStore.remove("name");
		$cookieStore.remove("isLogged");
		$cookieStore.remove("isUser");
		console.log("Logout Successful");
		bootbox.dialog({
			  message: 'Logout successful!',
			  onEscape: function() { console.log("Ecsape"); },
			  backdrop: true
			});
		$location.path("/");
	}
	
	$rootScope.initialize_var = function(){
			
			if($cookieStore.get("rights") == 0){
				return [$cookieStore.get("isLogged") , $cookieStore.get("name") , $cookieStore.get("isLogged")];	
			}
			else{
				return [$cookieStore.get("isLogged") , $cookieStore.get("name") , false];
			}
											     
	}
	
	$rootScope.initialize_button= function(){
		
	
			return $cookieStore.get("isUser");
		
			
	
		
										     
}
	
	$scope.createUser = function(id,name1,email,password,rights1){  
		var r = $cookieStore.get("rights");
		console.log(r);
		if(r == 0){
		console.log($cookieStore.get("authToken"));
			$http({
				method : 'POST',
				url : 'http://10.20.14.83:9003/roommanagement/user',
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
					'authToken' : $cookieStore.get("authToken")
				},
				data : {
					id : id,
					name : name1,
					email : email, 
					password: password,
					rights : rights1,
				}
			}).then(function successCallback(response) {
				//alert("Registration Successful");
				$scope.my1.message1 = true;
				console.log("User created successfully!");
				bootbox.dialog({
					  message: 'User created successfully!',
					  onEscape: function() { console.log("Ecsape"); },
					  backdrop: true
					});
				$location.path("/ViewUsers");
			}, function errorCallback(response) {
				$scope.my.message = true;
			//alert("You are not an authorised user to perform this operation");
			}
			
			);
			
	    }
		else{
			
			$scope.my.message = true;
			
		}	
	}
	
	
	$scope.showAllUsers = function(){
		
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9003/roommanagement/user',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
			}
		}).then(function successCallback(response) {
			
			var data = response.data;
			$rootScope.UserList=[];
			angular.forEach(data, function(value, key) {
			$rootScope.UserList = data;
				
		});
		
			console.log($rootScope.UserList + "Done!");
			
		}, function errorCallback(response) {
			bootbox.dialog({
				  message: 'Cannot retrieve the Users list !',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert("Cannot retrieve the Users' list ");
			

		});
	}
	

	
	$scope.createRoom = function() {
		if($scope.rid != undefined ||$scope.rname!= undefined||$scope.rcity != undefined||$scope.rlocation != undefined||$scope.rblock != undefined||$scope.raddress != undefined||
				$scope.rcapaciity != undefined||$scope.rtables != undefined||$scope.rmachines != undefined||$scope.rboard != undefined||$scope.rchart != undefined||
				$scope.rscreen != undefined||$scope.rprojector != undefined||$scope.rnet != undefined){
		 $http({
	           method : 'POST',
	           url : 'http://10.20.14.83:9003/roommanagement/room',
	           headers : {
	                 'Content-Type' : 'application/json',
	                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9003/',
	                 'authToken' : $cookieStore.get("authToken"),
	           },
	           data : {
	                 id: $scope.rid,
	                 roomName: $scope.rname,
	                 roomCity: $scope.rcity,
	                 roomLocation: $scope.rlocation,
	                 roomBlock: $scope.rblock,
	                 roomAddress: $scope.raddress,
	                 roomCapacity: $scope.rcapaciity,
	                 roomTables: $scope.rtables,
	                 roomMachines: $scope.rmachines,
	                 roomBoard: $scope.rboard,
	                 roomChart: $scope.rchart,
	                 roomScreen: $scope.rscreen,
	                 roomProjector:$scope.rprojector,
	                 roomInternet:$scope.rnet
	                 
	                 }
	    }).then(function successCallback(response) {
	    	bootbox.dialog({
				  message: 'Room created successfully',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
	          console.log("Room created successfully");
	          $location.path("/adminDashboard");
	         
	    }, function errorCallback(response) {
			//alert("");
	    	bootbox.dialog({
				  message: 'Please input all fields',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});

	    }
	    );
		
	}
		else{
			bootbox.dialog({
				  message: 'Please input all fields',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
		}	
	}
	
//	$scope.deleteRoom = function(roomid) {
//		$http(
//				{
//					method : 'DELETE',
//					url : 'http://10.20.14.83:9003/roommanagement/booking/' + roomid,
//					headers : {
//						'Content-Type' : 'application/json',
//						'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003',
//						 'authToken' : $cookieStore.get("authToken")
//					},
//					data : {
//						
//					}
//				}).then(
//				function successCallback(response) {
//					//alert("deleted successfully");
//					for(var v=0;v<$rootScope.RoomList.length;v++){
//						if(roomid==$rootScope.RoomList[v].id)
//						{
//							$rootScope.RoomList.splice(v,1);
//						}
//					}
//				},
//			
//				
//				function errorCallback(response) {
//					alert("No posts found");
//				});
//	}
	$scope.getRoomList = function(){
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9003/roommanagement/room',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
			}
		}).then(function successCallback(response) {
			var data = response.data;														
			$rootScope.RoomList=[];														
			angular.forEach(data, function(value, key){ 
			{
				$rootScope.RoomList = data;
			}
			//console.log("Into the for each");
			

			});
			
			
		}, function errorCallback(response) {
			//alert("Cannot retrive the room list ");
			bootbox.dialog({
				  message: 'Cannot retrive the room list',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});

		});
	};
	
	
	$scope.deleteRoom =  function(roomId){
		console.log("Delet room clicked");
		var url = 'http://10.20.14.83:9003//roommanagement/room/' + roomId;
		console.log(url);
		$http({
			method : 'DELETE',
			url : url,
			headers : {
				'authToken' : $cookieStore.get("authToken"),
				'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003'
			}
		}).then(function successCallback(response) {
			console.log(JSON.stringify(response, null,4));
			console.log("Room Deleted");
			bootbox.dialog({
				  message: 'Room deleted!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
						

		}, function errorCallback(response) {
			console.log(JSON.stringify(response.data,null,4));
			
			console.log("error");
			
			for(var v=0;v<$rootScope.RoomList.length;v++){
				if(roomId==$rootScope.RoomList[v].id)
				{	
					console.log("Found item");
					$rootScope.RoomList.splice(v,1);
					break;
				}
			}
			bootbox.dialog({
				  message: 'Room deleted!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			console.log("Room deleted");
			
		});
//		$scope.getRoomList();
	}
	
	
	
$scope.getStatus = function(){
	$rootScope.stat = ["REQUESTED","BOOKED","CANCELLED"];
}	

$scope.getCategories = function(){
	$rootScope.cat = ["TRAINING","OPEN_PROGRAM","BUSINESS_UNIT_PROGRAM"];
}


$scope.bkroom = function(rid) {
	$location.path('/bookRoom/'+rid);
	console.log(rid);
}
	
$scope.bookRoom = function(startDate,startTime, endDate,endTime,subject,roomType){
	
//	var bookid=$scope.updateid;
	
//	console.log(startDate.getFullYear()+ "" + startTime.getHours());
	
	
	if(startDate != undefined  && startTime!=undefined && endDate!=undefined && endTime!=undefined && subject!=undefined && roomType!=undefined )
		{
		
	
		
	var d = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),startTime.getHours(),startTime.getMinutes());
	var sDate = d.toISOString();
	console.log(sDate);
	var d1 = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate(),endTime.getHours(),endTime.getMinutes())
	var eDate = d1.toISOString();
	console.log(eDate);
	
	
	roomId = $scope.rid;
	console.log($cookieStore.get("authToken"));
	/* 
				startDate : "2016-09-10T10:25:43.511Z",
			    
				endDate : "2016-09-10T11:25:43.511Z", 

				status:"REQUESTED", 
				requestee:"57d69647027205adbbbafe4b", 
				subject:"java Training",
				category:"TRAINING"
				
				57d6ac24027205adbbbafe64,57d6ac36027205adbbbafe65,57d6ac45027205adbbbafe66,57d6ac58027205adbbbafe67
				
*/
		status = "REQUESTED";
		
		console.log("startdate "+sDate+"\n"+"enddate "+eDate+"\n"+"subject "+ subject+"\n"+"category "+roomType+"\n"+"roomId "+roomId+"\n"+"status "+status+"\n");
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9003/roommanagement/booking/' + roomId,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
				startDate : sDate,
				 endDate : eDate,
				 status : status,
				 requestee : $cookieStore.get("authToken"),
				 subject : subject,
				 category : roomType
							}
		}).then(function successCallback(response) {
			//$cookieStore.put("requestee",response.data.requestee);
			var data= response.data;
			$rootScope.bkid = data.id;
			bootbox.dialog({
				  message: 'Booking Successful',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert("Booking Successful");
			$location.path("/myBookings");
		}, function errorCallback(response) {
		   // alert("Booking Failed");
			bootbox.dialog({
				  message: 'This booking cannot be done. Please check room availabilty and try on some other time!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
		}
		
		);
	}
	else{
		bootbox.dialog({
			  message: 'Enter all the fields!',
			  onEscape: function() { console.log("Ecsape"); },
			  backdrop: true
			});
	}	
}


$scope.cancelBookingByUser = function(bookid){
	$http(
			{
				method : 'DELETE',
				url : 'http://10.20.14.83:9003/roommanagement/booking/' + bookid,
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003',
					 'authToken' : $cookieStore.get("authToken"),
				},
				data : {
					
				}
			}).then(
			function successCallback(response) {
			//	alert("Booking Cancelled successfully");
				for(var v=0;v<$rootScope.BookingList.length;v++){
					if(bookid==$rootScope.BookingList[v].id)
					{
						$rootScope.BookingList.splice(v,1);
					}
				}
				bootbox.dialog({
					  message: 'Booking cancelled successfully',
					  onEscape: function() { console.log("Ecsape"); },
					  backdrop: true
					});
			},
			function errorCallback(response) {
				//alert("Cancellation process failed!!");
				bootbox.dialog({
					  message: 'Cancellation process failed!!',
					  onEscape: function() { console.log("Ecsape"); },
					  backdrop: true
					});
			});
}

	
$scope.update = function(id , roomName , roomCity , roomLocation , roomBlock , roomAddress , roomCapacity , roomTables , roomMachines , roomBoard , roomChart , roomScreen , roomProjector , roomInternet) {
	$location.path('/updateRoom/'+id+'/'+roomName+'/'+roomCity+'/'+roomLocation+'/'+roomBlock+'/'+ roomAddress+'/'+roomCapacity+'/'+roomTables+'/'+roomMachines+'/'+roomBoard+'/'+roomChart+'/'+roomScreen+'/'+roomProjector+'/'+roomInternet);	
};

$scope.updateRoom = function() {
	var id=$scope.updateid;
	console.log(id);
	$scope.updatecapaciity=parseInt($scope.updatecapaciity);
	$http({
		method : 'PUT',
		url : 'http://10.20.14.83:9003/roommanagement/room',
		headers : {
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin': 'http://10.20.14.83:9003/',
			 'authToken' : $cookieStore.get("authToken"),
		},
		data : {
			id:id,
			roomName:$scope.updatename,
			roomCity:$scope.updatecity,
			roomLocation:$scope.updatelocation,
			roomBlock:$scope.updateblock,
			roomAddress:$scope.updateaddress,
			roomCapacity:$scope.updatecapaciity,
			roomTables:$scope.updatetables,
			roomMachines:$scope.updatemachines,
			roomBoard:$scope.updateboard,
			roomChart:$scope.updatechart,
			roomScreen:$scope.updatescreen,
			roomProjector:$scope.updateprojector,
			roomInternet:$scope.updatenet
		}
	}).then(function successCallback(response) {
		var data = response.data;
		if (data.message == "Room Updated Successfully") 
		{
			console.log(data.message);
			bootbox.dialog({
				  message: 'Room updated successfully!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert('Ad updated');
			$location.path("/adminDashboard");
		} else 
		{
			bootbox.dialog({
				  message: 'Room could not be updated!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert('Room not updated'+"\n\n"+"Not valid auth-token or postid");
		}		
	}, function errorCallback(response) {
		//alert("Server Error. Try After Some time: "+response);
		bootbox.dialog({
			  message: 'Room could not be updated!',
			  onEscape: function() { console.log("Ecsape"); },
			  backdrop: true
			});
	});
};
	
	
		
	
$scope.showBooking = function(){
	$http({
		method : 'GET',
		url : 'http://10.20.14.83:9003/roommanagement/booking',
		headers : {
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
			'authToken' : $cookieStore.get("authToken")
		},
		data : {
		}
	}).then(function successCallback(response) {
		
		var data = response.data;
		$rootScope.send = [];
		$rootScope.send1 = [];
		for(i=0;i<data.length;i++){
		sd = data[i].startDate;
		ed = data[i].endDate;
		date1 = new Date(ed);
		gfy1 = date1.getFullYear().toString();
		gm1 = (date1.getMonth()+1).toString();
		gd1 = date1.getDate().toString();
        $rootScope.send1[i] = gfy1 + '-' + gm1 + '-'+ gd1;
		
		date = new Date(sd);
		gfy = date.getFullYear().toString();
		gm = (date.getMonth()+1).toString();
		gd = date.getDate().toString();
        $rootScope.send[i] = gfy + '-' + gm + '-'+ gd;
        }
		$rootScope.BookingList=[];
		angular.forEach(data, function(value, key) {
		$rootScope.BookingList.push({id : value.id,sd :$rootScope.send[key], ed :$rootScope.send1[key],status:value.status,roomname:value.room.roomName,subject:value.subject,category:value.category});
			
			
	//$rootScope.BookingList = data;
			
	});
	
		console.log($rootScope.BookingList + "Done!");
		
	}, function errorCallback(response) {
		//alert("Cannot retrieve the booking list ");
		bootbox.dialog({
			  message: 'Cannot retrieve the booking list!',
			  onEscape: function() { console.log("Ecsape"); },
			  backdrop: true
			});

	});
}
	
	
	$scope.getBookingRequests = function(){
		
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9003/roommanagement/booking/request',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
			}
		}).then(function successCallback(response) {
			
			var data = response.data;
			$rootScope.senddate = [];
			$rootScope.sendtime = [];
			$rootScope.sendtime1 = [];
			$rootScope.senddate1 = [];
			for(i=0;i<data.length;i++){
			sd = data[i].startDate;
			ed = data[i].endDate;
			date1 = new Date(ed);
			gfy1 = date1.getFullYear().toString();
			gm1 = (date1.getMonth()+1).toString();
			gd1 = date1.getDate().toString();
			hr1 = date1.getHours().toString();
			min1 = date1.getMinutes().toString();
			var mid='AM';
			if(hr1==0){ //At 00 hours we need to show 12 am
			    hr1=12;
			    }
			    else if(hr1>12)
			    {
			    hr1=hr1%12;
			    mid='PM';
			    }
	        $rootScope.senddate1[i] = gfy1 + '-' + gm1 + '-'+ gd1;
			$rootScope.sendtime1[i] = hr1 + ' : ' + min1 + " " + mid;
			date = new Date(sd);
			gfy = date.getFullYear().toString();
			gm = (date.getMonth()+1).toString();
			gd = date.getDate().toString();
			hr = date.getHours().toString();
			min = date.getMinutes().toString();
			var mid1='AM';
			if(hr==0){ //At 00 hours we need to show 12 am
			    hr=12;
			    }
			    else if(hr>12)
			    {
			    hr=hr%12;
			    mid1='PM';
			    }
	        $rootScope.senddate[i] = gfy + '-' + gm + '-'+ gd;
	        $rootScope.sendtime[i] = hr + ' : ' + min + " " + mid1;
	        }
			$rootScope.BookingRequestList=[];
			angular.forEach(data, function(value, key) {
				$rootScope.BookingRequestList.push({id : value.id,sd :$rootScope.senddate[key],shr:$rootScope.sendtime[key], ed :$rootScope.senddate1[key],ehr :$rootScope.sendtime1[key], status:value.status,roomname:value.room.roomName,subject:value.subject,category:value.category});
				
				
			//$rootScope.BookingRequestList = data;
				
		});
		
			console.log($rootScope.BookingRequestList + "Done!");
			$location.path("/viewRequest");
		}, function errorCallback(response) {
			bootbox.dialog({
				  message: 'Cannot retrieve the booking request list!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert("Cannot retrieve the booking request list ");

		});
	}
	
	
	

	
	
	$scope.getSpecificRoom = function(roomid){
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9003/roommanagement/room' + roomid,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
			}
		}).then(function successCallback(response) {
			var data = response.data;
			$rootScope.ReqRoom = data;			
		}, function errorCallback(response) {
			//alert("Cannot retrieve the room list ");
		});
	}
	
	
	
	$scope.allocateRoomByAdmin = function(roomId,startDate,endDate,requestee,subject,category, st){
		if(st != "CANCELLED"){
		console.log(startDate);
		status = "BOOKED";
	    $http({
		method : 'PUT',
		url : 'http://10.20.14.83:9003/roommanagement/booking',
		headers : {
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
			'authToken' : $cookieStore.get("authToken")
		},
		data : {
			 id : roomId,
			 startDate : startDate,
			 endDate : endDate,
			 status : status,
			 requestee :  requestee,
			 subject : subject,
			 category : category 
		}
	}).then(function successCallback(response) {
		console.log("In success");
		$route.reload();
		//alert("Booking request confirmed! Room Allocated!!");
	}, function errorCallback(response) {
		bootbox.dialog({
			  message: 'Booking request confirmed! Room Allocated!',
			  onEscape: function() { console.log("Ecsape"); },
			  backdrop: true
			});
		//alert("Booking request confirmed! Room Allocated!!");
		$route.reload();
	}
	);
	}
		else{
			bootbox.dialog({
				  message: 'The room has been cancelled already!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
		}
		
	}

	
	
	$scope.cancelBookingByAdmin = function(id,startDate,endDate,subject,roomType,st){
		console.log("id is:"+id+"sdate " + startDate+endDate+subject+roomType);
		/*var d = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),startTime.getHours(),startTime.getMinutes());
		var sDate = d.toISOString();
		console.log(sDate);
		var d1 = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate(),endTime.getHours(),endTime.getMinutes())
		var eDate = d1.toISOString();
		console.log(eDate);*/
		status = "CANCELLED";
		$http({
			method : 'PUT',
			url : 'http://10.20.14.83:9003/roommanagement/booking/cancel',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get('authToken')
			},
			data : {
				id :id, 
				startDate : startDate,
				 endDate : endDate,
				 status : status,
				 requestee : $cookieStore.get("authToken"),
				 subject : subject,
				 category : roomType
			}
		}).then(function successCallback(response) {
			//response.data.status = "CANCELLED";
			//alert("Cancellation done!");
			bootbox.dialog({
				  message: 'Cancellation done!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			$route.reload();
		}, function errorCallback(response) {
			//alert("Cancellation failed!");
			bootbox.dialog({
				  message: 'Cancellation failed!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			$route.reload();
		});
	}



	
	$scope.changeRightsToUser = function(userid){
		$http(
				{
					method : 'DELETE',
					url : 'http://10.20.14.83:9003/roommanagement/rights/' + userid,
					headers : {
						'Content-Type' : 'application/json',
						'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003',
						 'authToken' : $cookieStore.get("authToken"),
					},
					data : {
						
					}
				}).then(
				function successCallback(response) {
					//alert("User's rights changed to 'User'!");
				},
				function errorCallback(response) {
					bootbox.dialog({
						  message: 'Attempt to change failed!',
						  onEscape: function() { console.log("Ecsape"); },
						  backdrop: true
						});
					//alert("Attempt to change failed!!");
				});
	}
	
	$scope.changeRightsToSubadmin = function(userid){
		
		 $http({
				method : 'PUT',
				url : 'http://10.20.14.83:9003/roommanagement/rights/' + userid,
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
					'authToken' : $cookieStore.get("authToken")
				},
				data : {
				}
			}).then(function successCallback(response) {
				//alert("User's rights changed to Sub Admin!");
			}, function errorCallback(response) {
			  // alert("Attempt to change failed!");
			}
			);
			}
	
	$scope.showAllUsers = function(){
		
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9003/roommanagement/user',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://10.20.14.83:9003',
				'authToken' : $cookieStore.get("authToken")
			},
			data : {
			}
		}).then(function successCallback(response) {
			
			var data = response.data;
			$rootScope.UserList=[];
			angular.forEach(data, function(value, key) {
			{
				$rootScope.UserList = data;
				
			}
			console.log($rootScope.UserList[0].name);
			$location.path("/ViewUsers");
		});
		
			console.log($rootScope.UserList + "Done!");
			
		}, function errorCallback(response) {
			bootbox.dialog({
				  message: 'Could not retrieve the users list!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
			//alert("Cannot retrive the Users' list ");

		});
	};
	
	$scope.deleteuser = function(uid){
		$http(
				{
					method : 'DELETE',
					url : 'http://10.20.14.83:9003/roommanagement/user/' + uid,
					headers : {
						'Content-Type' : 'application/json',
						'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003',
						 'authToken' : $cookieStore.get("authToken"),
					},
					data : {
						
					}
				}).then(
				function successCallback(response) {
					//alert("User deleted successfully");
					for(var v=0;v<$rootScope.UserList.length;v++){
						if(uid==$rootScope.UserList[v].id)
						{
							$rootScope.UserList.splice(v,1);
						}
					}
					bootbox.dialog({
						  message: 'User deleted successfully!',
						  onEscape: function() { console.log("Ecsape"); },
						  backdrop: true
						});
				},
				function errorCallback(response) {
					//alert("Deletion failed!!");
					bootbox.dialog({
						  message: 'Deleting the user failed!',
						  onEscape: function() { console.log("Ecsape"); },
						  backdrop: true
						});
				});
	}
	
	
	$scope.chkAvail=function(avaiRoom , roomieid)
	{
		$rootScope.rno = roomieid;
		console.log("In check avail - rno : "+$rootScope.rno);
		$location.path("/roomAvailability/"+avaiRoom);
		console.log(avaiRoom);
	}
	
	$scope.availableRoom=function(date,time,roomname)
	 {

		if(date == undefined  ||time==undefined || roomname==undefined){
			bootbox.dialog({
				  message: 'Enter all the fields!',
				  onEscape: function() { console.log("Ecsape"); },
				  backdrop: true
				});
		}
			
		//var date=$scope.date;
		// var date = "2016-09-11T16:30Z";
	//	 var roomname=$scope.rname;
	//	 var roomname = "new";
	 
		var d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),time.getHours(),time.getMinutes());
			var date1 = d.toISOString();
		 console.log("date : " + date1+"roomname : " + roomname);
		 $http({
			 method : 'GET',
			 url :'http://10.20.14.83:9003/roommanagement/availabilities/'+ date1+'/'+ roomname,
			 headers : {
				 'Content-Type' : 'application/json',
				 'Access-Control-Allow-Origin' : 'http://10.20.14.83:9003',
				 'authToken': $cookieStore.get("authToken"),
		   }
		  }).then(function successCallback(response){
			  	
			  	$rootScope.availableday =[];
		    	for(i=0,j=0;i<=6;i++)
		    	{
		    		x = i;
	   			 if(x == "0"){ y = "Sunday";}
	   			 if(x == "1"){ y = "Monday";}
	   			 if(x == "2"){ y = "Tuesday";}
	   			 if(x == "3"){ y = "Wednesday";}
	   			 if(x == "4"){ y = "Thursday";}
	   			 if(x == "5"){ y = "Friday";}
	   			 if(x == "6"){ y = "Saturday";}
	   			 
		    		 if(response.data[''+i] != "")
		    		 { 
		    			 console.log("Already booked on time specified on " + y );
		    			 $('#ordine1').modal('show');
		    			 break;
		    			
		    		 } else {
		    			 	    			 
		    			// console.log(response.data[''+i].room.roomName);
		    			 $rootScope.availableday[j] = y;
		    			 console.log("Room  available on " + y);
		    			 $('#ordine2').modal('show');
		    			 console.log("In available roo m- rno : "+$rootScope.rno);
		    			// $location.path('/bookRoom/'+$rootScope.rno);
		    		 }
		    		 j++;
		    	}
		  },function errorCallback(response){
		   console.log("Server Error");
		  });

	}
	 
	 $scope.goto_bookForm = function(){
		 $location.path('/bookRoom/'+$rootScope.rno);
	 }
	 
	 $scope.fullRoomDetail = function(room){
			$scope.detailRoom = room;
			$('#ordine').modal('show');
		} 
	 
	 $scope.login_redirect = function(){
			$location.path("/LoginPage");
		} 
	
	
}

controllers.ProductController = ProductController;

myApp.controller(controllers);

myApp.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'ProductController',
			templateUrl: 'home.html'
		})
		.when('/createRoom', {
			controller: 'ProductController',
			templateUrl: 'createRoom.html'
		})
		.when('/updateRoom/:id/:roomName/:roomCity/:roomLocation/:roomBlock/:roomAddress/:roomCapacity/:roomTables/:roomMachines/:roomBoard/:roomChart/:roomScreen/:roomProjector/:roomInternet', {
			controller: function($scope,$routeParams,$http,$cookieStore) 
			{				
				$scope.updateid=$routeParams.id;
				$scope.updatename=$routeParams.roomName;
				$scope.updatecity=$routeParams.roomCity;
				$scope.updatelocation=$routeParams.roomLocation;
				$scope.updateblock=$routeParams.roomBlock;
				$scope.updateaddress=$routeParams.roomAddress;
				$scope.updatecapaciity=$routeParams.roomCapacity;
				$scope.updatetables=$routeParams.roomTables;
				$scope.updatemachines=$routeParams.roomMachines;
				$scope.updateboard=$routeParams.roomBoard;
				$scope.updatechart=$routeParams.roomChart;
				$scope.updatescreen=$routeParams.roomScreen;
				$scope.updateprojector=$routeParams.roomProjector;
				$scope.updatenet=$routeParams.roomInternet;
				
				console.log($scope.updateid);
				console.log($scope.updatename);
				console.log($scope.updatenet);
				console.log($scope.updatelocation);
			},
			templateUrl: 'updateRoom.html'
		})
		.when('/ViewUsers', {
			controller: 'ProductController',
			templateUrl: 'ViewUsers.html'
		})
		.when('/viewRequest', {
			controller: 'ProductController',
			templateUrl: 'viewRequest.html'
		})
		.when('/rooms', {
			controller: 'ProductController',
			templateUrl: 'rooms.html'
		})
		.when('/LoginPage', {
			controller: 'ProductController',
			templateUrl: 'LoginUser.html'
		})
		.when('/registerPage', {
			controller: 'ProductController',
			templateUrl: 'RegisterUser.html'
		})
		.when('/adminDashboard', {
			controller: 'ProductController',
			templateUrl: 'adminDashboard.html'
		})
		.when('/userDashboard', {
			controller: 'ProductController',
			templateUrl: 'userDashboard.html'
		}).when('/bookRoom/:rid', {
			controller: function($scope,$routeParams,$http,$cookieStore) 
			{				
				$scope.rid=$routeParams.rid;
			},
			templateUrl: 'bookRoomForm.html'
		}).when('/myBookings', {
			controller: 'ProductController',
			templateUrl: 'myBookings.html'
		}).when('/roomAvailability/:avaiRoom', {
			controller: function($scope,$routeParams,$http,$cookieStore)
			{				
				$scope.avaiRoom=$routeParams.avaiRoom;
			},
			templateUrl: 'availability.html'
		}).when('/aboutUs', {
			controller: 'ProductController',
			templateUrl: 'aboutus.html'
		}).when('/contact', {
			controller: 'ProductController',
			templateUrl: 'contactus.html'
		})
		.otherwise({redirectTo: '/'})
});