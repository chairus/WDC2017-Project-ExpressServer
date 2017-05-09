$(document).ready(function() {
    // page is now ready, initialize the calendar...
    $('#calendar').fullCalendar({
        eventMouseover: function(calEvent, jsEvent) {
            var tooltip = "<span class=\"tooltipevent\" style=\"width:300px;height:auto;background:black;color:white;position:absolute;z-index:5;border-radius:6px;padding:5px;text-align:center\">" + calEvent.title + " on " + calEvent.start._d.toDateString() + " from " + $.fullCalendar.formatDate(calEvent.start, "h:mmt") + " to " + $.fullCalendar.formatDate(calEvent.end, "h:mmt") + " @ " + calEvent.location + "</span>";

            var $tooltip = $(tooltip).appendTo("body");

             $(this).mousemove(function(e) {
                $tooltip.css("top", e.pageY + 5);
                $tooltip.css("left", e.pageX + 10);
            });
        },

        eventMouseout: function(calEvent, jsEvent) {
            $('.tooltipevent').remove();
        },

        eventClick: function(event, jsEvent, view) {
            // Simulate click input for add entry so that the event listener for the save entry button will be added
            buttonAddEntry.click();

            // Set title of the entry to the title of the event
            journalEntryTitle = event.title;
        },

        eventLimit: 2
    });
});

var journalEntryTitle = null;
var activeIdEntry = null;    // Contains the ID of the saved journal entry curently being viewed/edited
var buttonDeleteEntry = document.querySelector(".btn-delete-entry");
var buttonAddEntry = document.querySelector(".btn-add-entry");
var buttonSaveEntry = document.querySelector(".btn-save-entry");
var buttonSettings = document.querySelector(".btn-settings");
var buttonApply = document.querySelector(".btn-apply");
var buttonCancel = document.querySelector(".btn-cancel");
var buttonOK = document.querySelector(".btn-ok-delete");
var buttonCancelDelete = document.querySelector(".btn-cancel-delete");
var buttonAddTag = document.querySelector(".btn-add-tag");
var buttonDeleteTag = document.querySelector(".btn-delete-tag");
var buttonSaveTag = document.querySelector(".btn-save-tag");
var buttonCancelTag = document.querySelector(".btn-cancel-tag");
var buttonLink = document.getElementById("btn-link");
var buttonSignOut = document.querySelector(".btn-sign-out");
var searchBar = document.getElementById("search-entry");
var maxResults = 100;    // Holds the number of calendar events to be fetched
var events = [];    // An object with an array property that holds the events in the Google Calendar



/* ===============================
    Google Calendar API functions
   =============================== */

// Client ID and API key from the Developer Console
var CLIENT_ID = '214746217802-jg3f9mu6oflodrvhott42cjj7ij6palc.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = buttonLink;
var signoutButton = buttonSignOut;

/**
*  On load, called to load the "auth2" library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.disabled = true;
        authorizeButton.innerHTML = "linked";
        listUpcomingEvents();
    } else {
        authorizeButton.disabled = false;
        authorizeButton.innerHTML = "link";
    }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
<<<<<<< HEAD
* Send request to Google servers to fetch events from Google calendar
=======
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
>>>>>>> b7ac840be7e6c61a361c5309ea501a2d580141e8
*/
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': maxResults,
      'orderBy': 'startTime'
    }).then(function(response) {
        addEventToCalendar(response);
    });
}


/* Retrieve events from Google Calendar and display it on the calendar. */

function addEventToCalendar(response) {
    var eventsGC = response.result.items;
    var when;

    if (eventsGC.length > 0) {
        for (var i = 0; i < eventsGC.length; i++) {
            events.push({});
            events[i].title = eventsGC[i].summary;    // Add title of the event
            events[i].location = eventsGC[i].location;    // Add location of event
            events[i].start = eventsGC[i].start.dateTime; // Add start date
            events[i].end = eventsGC[i].end.dateTime; // Add end date
            events[i].allDay = false;   // Will display the time
            when = eventsGC[i].start.dateTime;
            if (!when) {
                when = eventsGC[i].start.date;
            }
        }
    }

    $("#calendar").fullCalendar("addEventSource", events);  // Display Google Calendar events on the calendar
}


/* ======================================================================= */


function changeToHomepage() {
    // Display the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "block";
    document.getElementById("journal-entries-header").style.display = "block";
    document.getElementById("search-entry").style.display = "block";
    document.querySelector(".btn-add-entry").style.display = "block";

    // Hide the headers and buttons of edit entry page
    document.getElementById("edit-entry-header").style.display = "none";
    document.querySelector(".save-and-del-btn").style.display = "none";
}

function changeToEntryPage() {
    // Hide the headers, buttons and search input of the journal entry page
    document.getElementById("journal-entries").style.display = "none";
    document.getElementById("journal-entries-header").style.display = "none";
    document.getElementById("search-entry").style.display = "none";
    document.querySelector(".btn-add-entry").style.display = "none";

    // Display the headers and buttons of edit entry page
    document.getElementById("edit-entry-header").style.display = "block";
    document.querySelector(".save-and-del-btn").style.display = "block";
}

// Event handler for "Add entry" button
buttonAddEntry.addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var div = document.createElement('DIV');
            div.setAttribute("class", "entry-container");
            div.innerHTML = xhr.response;

            if (document.getElementById("journal-entries")) {
                changeToEntryPage();
                var rightPanelNode = document.getElementById("right-panel");
                var journalEntryNode = document.querySelector(".journal-entry-container");
                rightPanelNode.removeChild(journalEntryNode);
                rightPanelNode.appendChild(div);
            }

            if (journalEntryTitle) {
                document.getElementById("entry-title").value = journalEntryTitle;
                document.getElementById("entry-content").value = "";
                journalEntryTitle = null;
            }

            buttonSaveEntry.removeEventListener("click", replaceEntry);
            buttonSaveEntry.addEventListener("click", postEntry);
        }
    }

    xhr.open("GET", "/homepage.html/new&nolayout", true);
    xhr.send(null);

    window.history.pushState('', 'new entry form', '/homepage.html/new');
});

// Event handler for "Delete entry" button
buttonDeleteEntry.addEventListener("click", function() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;

    if (title !== "" || content !== "") {
        document.getElementById("confirm-delete").classList.toggle("show");
        document.querySelector(".modal").style.display = "block";
    } else {
        removeEntry();
    }
});

// Event handlers for confirming the deletion of an entry
buttonOK.addEventListener("click", function() {
    document.getElementById("confirm-delete").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
    removeEntry();
});

buttonCancelDelete.addEventListener("click", function() {
    document.getElementById("confirm-delete").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

function removeEntry() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var div = document.createElement('DIV');
            div.setAttribute("class", "journal-entry-container");
            div.innerHTML = xhr.response;

            var editEntryNode = document.querySelector(".entry-container");
            var rightPanelNode = document.getElementById("right-panel");
            rightPanelNode.removeChild(editEntryNode);
            rightPanelNode.appendChild(div);

            changeToHomepage();
            activeIdEntry = null;
            window.history.pushState('', 'homepage url', '/homepage.html');
        }
    }

    xhr.open("DELETE", "/homepage.html/" + activeIdEntry, true);
    xhr.send(null);
}

// Event handler for adding a tag
buttonAddTag.addEventListener("click", function() {
    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "block";
});

// Event handler for saving a tag
buttonSaveTag.addEventListener("click", function() {
    tagSectionChildren = document.getElementById("tags").childNodes;
    var create = true;
    var tagTitle = document.getElementById("tag-title").value;
    for (var i = 0; i < tagSectionChildren.length; i++) {
        if (tagSectionChildren[i].lastElementChild.innerHTML == tagTitle) {
            create = false;
            document.getElementById("tag-title").value = "";
            break;
        }
    }

    if (tagTitle != "" && create) {
        createTag();
    }

    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

buttonCancelTag.addEventListener("click", function() {
    document.getElementById("tag-title").value = "";
    document.getElementById("add-tag-entry").classList.toggle("show");
    document.querySelector(".modal").style.display = "none";
});

// Event handler for deleting a tag
buttonDeleteTag.addEventListener("click", function() {
    var parent = document.getElementById("tags");
    var children = parent.childNodes;
    var child;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.firstChild.checked) {
            parent.removeChild(child);
            i--;
        }
    }
});

// Event handler for signing out
buttonSignOut.addEventListener("click", function() {
    location.href = "welcome.html";
});


function createTag() {
    var tagSection = document.getElementById("tags");
    var tagTitle = document.getElementById("tag-title").value;
    var tagLi = document.createElement("li");
    tagLi.id = tagTitle;
    var tagCheckbox = document.createElement("input");
    tagCheckbox.type = "checkbox";
    var tagLabel = document.createElement("label");
    var tagTitleText = document.createTextNode(tagTitle);
    tagLabel.appendChild(tagTitleText);
    tagLi.appendChild(tagCheckbox);
    tagLi.appendChild(tagLabel);
    tagSection.appendChild(tagLi);
    document.getElementById("tag-title").value = "";
}

function postEntry() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    var date = (new Date()).toDateString();
    var params = "entryTitle=" + title + "&entryContent=" + content + "&entryDate=" + date;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/homepage.html", true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var div = document.createElement('DIV');
            div.setAttribute("class", "journal-entry-container");
            div.innerHTML = xhr.response;

            var editEntryNode = document.querySelector(".entry-container");
            var rightPanelNode = document.getElementById("right-panel");
            rightPanelNode.removeChild(editEntryNode);
            rightPanelNode.appendChild(div);

            changeToHomepage();
            window.history.pushState('', 'homepage url', '/homepage.html');
        }
    }

    xhr.send(params);
}


function editEntry(id) {
    activeIdEntry = id;
    buttonAddEntry.click();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var entry = JSON.parse(xhr.response);

            document.getElementById("entry-title").value = entry[0].title;
            document.getElementById("entry-content").value = entry[0].content;

            // Change Event Listener of the save button
            document.querySelector(".btn-save-entry").removeEventListener("click", postEntry);
            document.querySelector(".btn-save-entry").addEventListener("click", replaceEntry);

            window.history.pushState('', 'edit/show page', '/homepage.html/' + id);
        }
    }

    xhr.open("GET", "/homepage.html/" + id, true);

    setTimeout(function() {
        xhr.send(null);
    }, 300);
}


function replaceEntry() {
    var title = document.getElementById("entry-title").value;
    var content = document.getElementById("entry-content").value;
    var params = "entryTitle=" + title + "&entryContent=" + content;

    var xhr = new XMLHttpRequest();

    xhr.open("PUT", "/homepage.html/" + activeIdEntry, true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var div = document.createElement('DIV');
            div.setAttribute("class", "journal-entry-container");
            div.innerHTML = xhr.response;

            var editEntryNode = document.querySelector(".entry-container");
            var rightPanelNode = document.getElementById("right-panel");
            rightPanelNode.removeChild(editEntryNode);
            rightPanelNode.appendChild(div);

            changeToHomepage();
            activeIdEntry = null;   // No saved entry being viewed/modified
            window.history.pushState('', 'homepage url', '/homepage.html');
        }
    }

    xhr.send(params);
}

//Event handler for "Setting" button
buttonSettings.addEventListener("click",function(){
    document.getElementById("settPopup").classList.toggle("show");
    document.getElementById("settModal").style.display = "block";
})

//Event handler for "Apply" button
buttonApply.addEventListener("click",function(){
    var a = document.getElementById("color-options");
    var usr = a.options[a.selectedIndex].value;
    if(usr == "Red")
    {
      document.getElementById("indexbody").style.backgroundColor = "Crimson";
      document.getElementById("calendar-header").style.backgroundColor = "darkred"
      document.getElementById("journal-entries-header").style.backgroundColor = "darkred"
      document.getElementById("tag-header").style.backgroundColor = "darkred";
      document.getElementById("edit-entry-header").style.backgroundColor = "darkred";
      document.getElementById("settPopup").style.backgroundColor = "darkred";

    }
    else if(usr == "Blue")
    {
      document.getElementById("indexbody").style.backgroundColor = "dodgerblue";
      document.getElementById("calendar-header").style.backgroundColor = "darkblue"
      document.getElementById("journal-entries-header").style.backgroundColor = "darkblue"
      document.getElementById("tag-header").style.backgroundColor = "darkblue";
      document.getElementById("edit-entry-header").style.backgroundColor = "darkblue";
      document.getElementById("settPopup").style.backgroundColor = "darkblue";
    }

document.getElementById("settModal").style.display = "none";
document.getElementById("settPopup").classList.toggle("show");

})

//Event handler for "Cancel" button
buttonCancel.addEventListener("click",function(){
  	document.getElementById("settPopup").classList.toggle("show");
  	document.getElementById("settModal").style.display = "none";
})


// Event handler for search bar
searchBar.addEventListener("change", function() {
    var searchTerm = "searchTerm=" + searchBar.value.toLowerCase();

    // Send XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/homepage.html/search", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var div = document.createElement('DIV');
            div.setAttribute("class", "journal-entry-container");
            div.innerHTML = xhr.response;

            var editEntryNode = document.querySelector(".journal-entry-container");
            var rightPanelNode = document.getElementById("right-panel");
            rightPanelNode.removeChild(editEntryNode);
            rightPanelNode.appendChild(div);
        }
    }

    xhr.send(searchTerm);
})
