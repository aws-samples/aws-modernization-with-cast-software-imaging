var userToken = '6b2c9ab7-21c1-420a-bee2-422e8639b58f';
var serverUrl = 'https://demo.casthighlight.com';

$(".formReset").click(function(){
	$("#userEmail").val('');
	$("#preparingData").hide();
	$("#successData").hide();
	$("#loadingScreen").fadeOut();
});

$("#inviteUserBtn").click(function() {		
	if($("#userEmail").val()) {
		var userEmail = $("#userEmail").val();
		if(!(userEmail.length > 5 && userEmail.includes("@") === true && userEmail.includes(".") === true)) { 
			alert("A valid email is required to complete the registration.");
		}
		else {
			$("#loadingScreen").fadeIn();
			$("#preparingData").fadeIn();
			var payload = '[{"name": "'+userEmail+'","clientRef": "'+userEmail+'","parent": {"id": "21224"}}]';
			var createdDomainId;
			var statusCode = 'Start'
			$.ajax({
				async: false,
				url: serverUrl+"/WS2/domains/21224/domains",			
				type: 'POST',
				dataType: 'json',
				data: payload,
				contentType: 'application/json; charset=utf-8',
				success: function (result) {
												
					createdDomainId = result.result[0].id;
					statusCode = statusCode + ' - CreatedDomain ' + createdDomainId
					userEmail = userEmail.split('@');
					userEmail = userEmail[0]+'+AWS@'+userEmail[1];

					var payload = '[{"email": "'+userEmail+'","status": "activated","roles": [{"domain_id": "'+createdDomainId+'","role": "manager"},{"domain_id": "21225","role": "viewer"}]}]';
					
					$.ajax({
						async: false,
						url: serverUrl+"/WS2/domains/21224/users",
						
						type: 'POST',
						dataType: 'json',
						data: payload,
						contentType: 'application/json; charset=utf-8',
						success: function (result) {
							$("#successData").fadeIn();
							statusCode = statusCode + ' - Invited ' + userEmail
						},
						beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer '+userToken); },
						error: function (xhr, status){	
							console.log('err::User Invite');
							statusCode = statusCode + ' - InviteError'
						}						
					});
				},
				beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer '+userToken); }, //set tokenString 
				error: function (xhr, status) {
					console.log('err::Domain Creation');
					statusCode = statusCode + ' - DomainError'
				}				
			});
			var mailMessage = 'First Name: ' + $("#firstName").val() + '\n Last Name: ' + $("#lastName").val() + '\n Company: ' + $("#companyName").val() + '\n Country: ' + $("#country").val() + '\n email: ' + userEmail + '\n The enrollment into the portfolio finished with status ' + statusCode;
			payload = 'subject=AWS%20Workshop%20Enrollment&accessKey=0073d362-3256-4706-979c-69960d8620ba&message='+mailMessage;
			$.ajax({
				url: 'https://api.staticforms.xyz/submit',
				type: 'POST',
				dataType: 'json',
				data: payload,
				success: function(result) {
				  console.log('Mail sent');
				},
				error: function(xhr, resp, text) {
				  console.log('err::Mail Warning')
				}
			 });
			$("#preparingData").hide();	
		};
	}
});