# ServiceManager -> Kanboard Integration
Two bookmarklets to support ServiceManager->Kanboard integration (in the event that you don't have access to the APIs for either service).

* _Export_Ticket.js_: Extracts the current item in ServiceManager to a JSON-formatted object. This object gets added to the page's DOM as a plain string inside a text-box, which then gets passed to Kanboard by being inserted into the user's clipboard. This was done to avoid various browser security policies...

* _Import_Ticket.js_: Grabs the above JSON object from your clipboard and builds out a new ticket in Kanboard using the item's fields. You can specify your own rules as per tags & categories etc.
