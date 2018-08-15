function importTicket(){
	/** Check if we're on the correct site - only check by URL segment now */
	/** Now importTicket() can seamlessly support both URL formats */
	var requiredPageURL = "BoardViewController";
	var CLS = false;
	if (window.location.href.indexOf(requiredPageURL) <= -1){
		if(confirm('This script must be run on the Kanboard dashboard. Go there now?')){
			if (window.location.href.contains("webhostingkanban")){
				var URLdomain = window.location.href.split('?')[0];
			} else {
				var URLdomain = "http://webhostingkanban/";
			}
			var URLtoRedirect = URLdomain + "?controller=BoardViewController&action=show&project_id=1"; 
			window.open(URLtoRedirect); 
			console.log("Closing page");
			return;
		} 
		return;
	} 

	/** Need to add a button element to the web page with a click event-handler */
	var kanboardHeaderElement = document.getElementsByClassName("title-container")[0];
	var pasteButton = document.createElement("button");
	var pasteButtonText = document.createTextNode("Import ticket to Kanboard");
	pasteButton.appendChild(pasteButtonText);
	pasteButton.id = "pasteButtonID";

	/** Building text input element for holding pasted ticket data */
	var ticketDataHiddenInput =  document.createElement("input");
	/** ticketDataHiddenInput.style = "display: none;";  */
	ticketDataHiddenInput.id = "hiddenTicketInput";

	pasteButton.addEventListener("click", function(){
		/** Retrieve the new ticket button element, verifying it is correct */
		/** if CLS flag set to true, create a new ticket in the CLS backlog instead of the BAU backlog */
		if (CLS){
			var newTaskItemLink = $(".board-swimlane-columns-7 > th:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)" ).get(0);
		} else {
			var newTaskItemLink = $(".board-swimlane-columns-1 > th:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)" ).get(0);
		}

		if (newTaskItemLink.title == "Add a new task"){
			console.log("The 'Add a new task' link element has been found on the page.");
		} else {
			console.log("The 'Add a new task' link element could not be found on the page. Function exiting.");
			return;
		}

		/** retrieve ticketdata from the input field, will need to add tests to ensure it's a valid object */
		var ticketDataObjectString = document.getElementById("hiddenTicketInput").value;
		console.log("found following ticketDataObjectString value: " + ticketDataObjectString);
		var ticketDetails = JSON.parse(ticketDataObjectString);

		/** Do any category/name transformations necessary */

		/** Insert values from the object into the new ticket form, we'll do this in a setTimeOut() event until I add a proper load event handler */
		newTaskItemLink.click();

		var kanboardTicketTitle = ticketDetails.ticketID + ' - ' + ticketDetails.ticketTitle;
		var kanboardTicketDescription = "**Ticket ID:** " + ticketDetails.ticketID + "  \n" + '**Current Phase:** ' + ticketDetails.ticketPhase + '  \n' + '**Initiator:** ' + ticketDetails.ticketInitiator + '  \n' + '**Description:** ' + ticketDetails.ticketDescription + '  \n';

		var ticketCategoryCodeMappings = {
			NO_CATEGORY: 0,
			ACCESS: 74,
			ADMIN: 75,
			ADMIN_TECHNICAL: 92,
			ANALYSIS: 76,
			CONFIG_CHANGE: 77,
			ECAB_EXCAB: 78,
			EMAIL: 93,
			INCIDENT_PROD: 79,
			INCIDENT_UAT: 80,
			INFORMATION: 81,
			MEETING: 91,
			NEW_SETUP: 82,
			OOH: 83,
			PATCH_PROD: 84,
			PATCH_UAT: 85,
			PROBLEM_MANAGEMENT: 87,
			PRODUCT_REFRESH: 89,
			SCRIP: 9,
			WALKUP: 90
		};

		/** Determine a possible tag for the item based on its title */
		var ticketTag = "";

		/** to add: citadel, ssis, sso, dpr */
		if (ticketDetails.ticketTitle.toLowerCase().includes('dpsng')){
			ticketTag = "DPSNG";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('cpm2')){
			ticketTag = "CPM2";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('sso')){
			ticketTag = "SSO";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('ssrs')){
			ticketTag = "SSRS";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('ssis')){
			ticketTag = "SSIS";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('dpr')){
			ticketTag = "DPR";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('gv')){
			ticketTag = "GV";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('scrip')){
			ticketTag = "SCRIP";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('citadel')){
			ticketTag = "Citadel";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('TeamCity')){
			ticketTag = "TeamCity";
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('OctopusDeploy')){
			ticketTag = "OctopusDeploy";
		} else { 
			console.log('No recognized keywords found in ticket title for category determination.');
		}


		/** Trying to determine if this might be a PROD/UAT deployment */
		var ticketCategoryCode = 0;

		if (ticketDetails.ticketTitle.toLowerCase().includes('uat')){
			ticketCategoryCode = ticketCategoryCodeMappings.PATCH_UAT;
			console.log("UAT Patch ticket determined");
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('prod')){
			ticketCategoryCode = ticketCategoryCodeMappings.PATCH_PROD;
			console.log("PROD Patch ticket determined");
		} else {
			console.log('No recognized keywords found in ticket title for category determination.');
		}

		setTimeout(function(){ 
			document.getElementById('form-title').value = kanboardTicketTitle;
			$('.text-editor-write-mode > textarea:nth-child(2)').get(0).value = kanboardTicketDescription; 
			document.getElementById('form-reference').value = ticketDetails.ticketID;
			document.getElementById('form-category_id').value = ticketCategoryCode;

			if (ticketTag != ""){
				
				var tagid = ticketTag;
				var tagtext = ticketTag;

				if ($('#form-tags').find("option[value='" + tagid + "']").length) {
					$('#form-tags').val(tagid).trigger('change');
				} else { 
					var newOption = new Option(tagtext, tagid, true, true);
					$('#form-tags').append(newOption).trigger('change');
				} 

				/** Now remove the added button and input elements from the Kanboard header */
				var ticketDataHiddenInputToDelete =  document.getElementById("hiddenTicketInput");
				var pasteButtonToDelete =  document.getElementById("pasteButtonID");
				ticketDataHiddenInputToDelete.parentNode.removeChild(ticketDataHiddenInputToDelete);
				pasteButtonToDelete.parentNode.removeChild(pasteButtonToDelete);
			}

		}, 2000);

	}); 


	kanboardHeaderElement.appendChild(pasteButton);
	kanboardHeaderElement.appendChild(ticketDataHiddenInput);
	document.getElementById("hiddenTicketInput").focus();
}
importTicket();
