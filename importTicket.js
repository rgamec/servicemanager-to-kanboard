function importTicket(){
	/** Check if we're on the correct site */
	var requiredPageURL = "http://webhostingkanban/?controller=BoardViewController&action=show&project_id=1";
	if (window.location.href != requiredPageURL){
		if(confirm('This script must be run on the Kanboard dashboard. Go there now?')){
			window.open("http://webhostingkanban/?controller=BoardViewController&action=show&project_id=1"); 
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
		var newTaskItemLink = $(".board-swimlane-columns-1 > th:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)" ).get(0);
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
			ACE_ITEM: 56,
			APP_FABRIC: 55,
			AXIOM: 61,
			BUI: 45,
			CASS: 53,
			CERTIFICATE_RENEW: 14,
			CITADEL: 33,
			CPAY: 46,
			CPM2: 34,
			DPR_CASTLE: 20,
			DPR_LIAB: 21,
			DPR_OBJECTIVE: 18,
			DPR_TWIST: 19,
			DPS_45: 25,
			DPSNG: 24,
			EMPLOYEE: 22,
			EMPLOYEE_MOB: 23,
			ESB: 54,
			F5: 58,
			FINANCE_MANDATE_VALIDATION: 62,
			GENERAL: 57,
			GSP: 50,
			GV: 31,
			HTRAK: 47,
			IDENTITY: 41,
			INSEARCH: 42,
			INVESTOR: 30,
			IPO_API: 43,
			IPO_PAYMENTS: 44,
			ISCRIP: 27,
			ISSUER: 26,
			OCTOPUS_DEPLOY: 36,
			PDV_SERVICE: 49,
			RABBITMQ: 35,
			RIGHTS_ISSUES: 48,
			ROI: 38,
			SCRIP: 9,
			SQL: 12,
			SSIS: 51,
			SSO: 6,
			SSRS: 52,
			SUMO: 60,
			TAX_MANAGER: 32,
			TEAM_CITY: 37,
			TFS: 59,
			UKEIPO: 40,
			VORKS: 28,
			VORKS_API: 29,
			WORLDPAY: 39
		};

		/** Determine a possible category for the item based on its title */
		var ticketCategoryCode = 0;

		/** to add: citadel, ssis, sso, dpr */
		if (ticketDetails.ticketTitle.toLowerCase().includes('dpsng')){
			ticketCategoryCode = ticketCategoryCodeMappings.DPSNG;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('cpm2')){
			ticketCategoryCode = ticketCategoryCodeMappings.CPM2;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('sso')){
			ticketCategoryCode = ticketCategoryCodeMappings.SSO;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('ssrs')){
			ticketCategoryCode = ticketCategoryCodeMappings.SSRS;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('ssis')){
			ticketCategoryCode = ticketCategoryCodeMappings.SSIS;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('dpr')){
			ticketCategoryCode = ticketCategoryCodeMappings.DPR;
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('scrip')){
			ticketCategoryCode = ticketCategoryCodeMappings.SCRIP;
		} else { 
			console.log('No recognized keywords found in ticket title for category determination.');
		}


		/** Trying to determine if this might be a PROD/UAT deployment */
		var ticketTag = "";

		if (ticketDetails.ticketTitle.toLowerCase().includes('uat')){
			ticketTag = "Patch UAT";
			console.log("UAT Patch ticket determined");
		} else if (ticketDetails.ticketTitle.toLowerCase().includes('prod')){
			ticketTag = "Patch PROD";
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
				var tagElement = document.getElementsByClassName("select2-selection__rendered")[0];
				var LIelement = document.createElement("LI");

				LIelement.title = ticketTag;
				LIelement.className = "select2-selection__choice";

				var innerSpanElement = document.createElement("span");
				innerSpanElement.className = "select2-selection__choice__remove";
				innerSpanElement.role = "presentation";
				innerSpanElement.innerHTML = "x";

				var innerTextNodeElement = document.createTextNode(ticketTag);
				
				LIelement.appendChild(innerSpanElement);
				LIelement.appendChild(innerTextNodeElement);

				/** search element needs to come after the added tag */
				tagElement.insertBefore(LIelement, tagElement.firstChild);

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



