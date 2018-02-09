function retrieveTicket(){

	/** No point letting the script continue if we're not on Service Manager */
	var requiredPageURL = "http://servicemanager.americas.cshare.net";
	if (!window.location.href.startsWith(requiredPageURL)){
		if(confirm('This script can only run on a Service Manager ticket. Go to Service Manager now?')){
			window.open(requiredPageURL); 
			return;
		}
		return; 
	}


	/** Pseudo-enum to make code more readable */
	var ticketTypes = {
		INCIDENT: 1,
		PROBLEM: 2,
		TASK: 3,
		LINE: 4,
		CHANGE: 5,
		INTERACTION: 6
	};

	var ticketData = [
						{
							type: ticketTypes.INCIDENT,
							ticketTabTitleSearch: "IM",
							ticketTabTitleOffset: 24,
							ticketTabTitleLength: 8,
							ticketIDSelector: "X4",
							ticketTitleSelector: "X68",
							ticketDescriptionSelector: "X71",
							ticketInitiatorSelector: "X21",
							ticketPhaseSelector: "X7"
						},
						{
							type: ticketTypes.PROBLEM,
							ticketTabTitleSearch: "PM",
							ticketTabTitleOffset: 9,
							ticketTabTitleLength: 7,
							ticketIDSelector: "X4",
							ticketTitleSelector: "X73",
							ticketDescriptionSelector: "X75",
							ticketInitiatorSelector: "X28",
							ticketPhaseSelector: "X7"
						},
						{
							type: ticketTypes.TASK,
							ticketTabTitleSearch: "Task T",
							ticketTabTitleOffset: 5,
							ticketTabTitleLength: 7,
							ticketIDSelector: "X4",
							ticketTitleSelector: "X55",
							ticketDescriptionSelector: "X57",
							ticketInitiatorSelector: "X47",
							ticketPhaseSelector: "X12"
						},
						{
							type: ticketTypes.LINE,
							ticketTabTitleSearch: "O",
							ticketTabTitleOffset: 11,
							ticketTabTitleLength: 12,
							ticketIDSelector: "X8",
							ticketTitleSelector: "X57",
							ticketDescriptionSelector: "X59",
							ticketInitiatorSelector: "X38",
							ticketPhaseSelector: "X26"
						},
						{
							type: ticketTypes.CHANGE,
							ticketTabTitleSearch: "Change C",
							ticketTabTitleOffset: 7,
							ticketTabTitleLength: 7,
							ticketIDSelector: "X4",
							ticketTitleSelector: "X74",
							ticketDescriptionSelector: "X76",
							ticketInitiatorSelector: "X22",
							ticketPhaseSelector: "X8"
						},
						{
							type: ticketTypes.INTERACTION,
							ticketTabTitleSearch: "Interaction",
							ticketTabTitleOffset: 0,
							ticketTabTitleLength: 0,
							ticketIDSelector: "",
							ticketTitleSelector: "",
							ticketDescriptionSelector: "",
							ticketInitiatorSelector: "",
							ticketPhaseSelector: ""
						}
					];


	ticketData.forEach(function(element){

		var ticketDetails = {
			ticketType: "",
			ticketID: "",
			ticketTitle: "",
			ticketInitiator: "",
			ticketDescription: "",
			ticketPhase: ""
		};

		/** Get title of currently active tab */
		var tabTitle = document.getElementsByClassName("x-tab-strip-active")[0].getElementsByClassName("x-tab-strip-text")[0].innerHTML;
		
		if (tabTitle.indexOf(element.ticketTabTitleSearch) != -1){
			console.log("[DEBUG] This ticket with tab title " + tabTitle + " is of type " + element.type);
			ticketDetails.ticketType = element.type;
			ticketDetails.ticketID = tabTitle.substr(element.ticketTabTitleOffset, element.ticketTabTitleLength);

			/** TODO: Refactor the below code to avoid repetition */
			/** Retrieving the currently active tab iframe element */
			var tabSelector = document.getElementsByClassName("x-tab-strip-active")[0].id.substr(16);
			console.log("[DEBUG] Found a tab with the class name: " + tabSelector);
			var tabObject = document.getElementById(tabSelector).getElementsByClassName("ux-mif")[0];

			/** Retrieving the ticket title */
			try {
				ticketDetails.ticketTitle = tabObject.contentDocument.getElementById(element.ticketTitleSelector).value;

				/** Bugfix: Title field sometimes marked out by X73 CSS class */
				if (ticketDetails.ticketTitle === undefined){
					ticketDetails.ticketTitle = tabObject.contentDocument.getElementById("X73").value;
				}
				console.log("[DEBUG] ticketTitle was found: " + ticketDetails.ticketTitle);
			} catch (err){
				console.log("[DEBUG] ticketTitle was undefined");
				ticketDetails.ticketTitle = "Null";
			}

			/** Retrieving the ticket ID */
			try {
				ticketDetails.ticketID = tabObject.contentDocument.getElementById(element.ticketIDSelector).value;
				console.log("[DEBUG] ticketID was found: " + ticketDetails.ticketID);
			} catch (err){
				console.log("[DEBUG] ticketID was undefined");
				ticketDetails.ticketID = "Null";
			}

			/** Retrieving the ticket description */
			try {
				ticketDetails.ticketDescription = tabObject.contentDocument.getElementById(element.ticketDescriptionSelector).value;

				/** Bugfix: Description field sometimes marked out by X75 CSS class */
				if (ticketDetails.ticketDescription === undefined){
					ticketDetails.ticketDescription = tabObject.contentDocument.getElementById("X75").value;
				}
				console.log("[DEBUG] ticketDescription was found: " + ticketDetails.ticketDescription);
			} catch (err){
				console.log("[DEBUG] ticketDescription was undefined");
				ticketDetails.ticketDescription = "Null";
			}
			
			/** Retrieving the ticket initiator */
			try {
				ticketDetails.ticketInitiator = tabObject.contentDocument.getElementById(element.ticketInitiatorSelector).value;
				console.log("[DEBUG] ticketInitiator was found: " + ticketDetails.ticketInitiator);
			} catch (err){
				console.log("[DEBUG] ticketInitiator was undefined");
				ticketDetails.ticketInitiator = "Null";
			}
			
			/** Retrieving the ticket phase */
			try {
				ticketDetails.ticketPhase = tabObject.contentDocument.getElementById(element.ticketPhaseSelector).value;
				console.log("[DEBUG] ticketPhase was found: " + ticketDetails.ticketPhase);
			} catch (err){
				console.log("[DEBUG] ticketPhase was undefined");
				ticketDetails.ticketPhase = "Null";
			}
			
			var confirmationString = "";
			confirmationString += "Copy the following ticket into your clipboard?\n\n";
			confirmationString += "Ticket ID: " + ticketDetails.ticketID + "\n";
			confirmationString += "Ticket Title: " + ticketDetails.ticketTitle + "\n";
			confirmationString += "Ticket Phase: " + ticketDetails.ticketPhase + "\n";
			confirmationString += "Ticket Initiator: " + ticketDetails.ticketInitiator + "\n";
			confirmationString += "Ticket Description: " + ticketDetails.ticketDescription.substr(0,40) + "..." + "\n";

			if(confirm(confirmationString)){
				/** Use JSON.stringify to convert ticket object into a string */
				var ticketDataString = JSON.stringify(ticketDetails);
				console.log("ticketDataString was turned to JSON object: " + ticketDataString);

				console.log('Now exporting ticket to Kanboard');

				/** Saving reference to site header element */
				var headerElement = document.getElementsByClassName("masthead-title")[0];

				/** Embed a hidden text input field with ticket data string */
				var ticketDataHiddenInput =  document.createElement("input");
				/** ticketDataHiddenInput.style = "display: none;";  */
				ticketDataHiddenInput.value = ticketDataString;
				ticketDataHiddenInput.id = "hiddenTicketInput";

				/** Embed a new button in the site header with an event handler */
				var copyButton = document.createElement("button");
				var buttonText = document.createTextNode("Send to Kanboard");
				copyButton.id = "copyButtonID";
				copyButton.appendChild(buttonText);

				copyButton.addEventListener("click", function(){
					/** Start copying the ticket data from the hidden input field */
				    console.log("Now copying ticket data to clipboard");
				    var ticketDataStringElement = document.getElementById("hiddenTicketInput").value;
				    console.log("Found following text in hidden element: " + ticketDataStringElement);

					document.querySelector("#hiddenTicketInput").select();

					try {
						var successful = document.execCommand('copy');
						var msg = successful ? 'successful' : 'unsuccessful';
						console.log('Copying ticket to clipboard returned: ' + msg);

						/** Remove the button and hidden input we added */
						var hiddenInputToDelete = document.getElementById("hiddenTicketInput");
						var copyButtonToDelete = document.getElementById("copyButtonID");
						hiddenInputToDelete.parentNode.removeChild(hiddenInputToDelete);
						copyButtonToDelete.parentNode.removeChild(copyButtonToDelete);

						/** Open Kanboard in a new tab/window (browser-specific) */
						window.open("http://webhostingkanban.emea.cshare.net/?controller=BoardViewController&action=show&project_id=1");
					} catch (err) {
						console.log('Unable to access the clipboard.');
					}

				}); 
				headerElement.appendChild(copyButton);
				headerElement.appendChild(ticketDataHiddenInput);

				/** Copy the ticketDataString into the user's clipboard */

				/** Possible feature: Launch another confirmation window asking if user wants to go straight to Kanboard - or launch window anyway */
			};
		} else {
			console.log("[DEBUG] This ticket with tab title " + tabTitle + " is not of type " + element.type);
		};
	});
}
retrieveTicket();
