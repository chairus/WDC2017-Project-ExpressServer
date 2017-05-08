var express = require('express');
var router = express.Router();
var path = require('path');
var uniqid = require('uniqid');
var ejs = require('ejs');

var journalEntries = [];

/* GET welcome page. */
router.get("/", function(req, res) {
    res.render("welcome");
});

// EDIT - Display the edit form by sending an XMLHttpRequest to the server
router.get("/homepage.html/new&nolayout", function(req, res) {
    res.sendFile(path.join(__dirname, '../views', 'entry_form.ejs'));
});

router.get("/homepage.html/userID", function(req, res) {
    res.render("homepage", {journalEntries: journalEntries});
});

router.get("/homepage.html/new", function(req, res) {
    res.redirect("/homepage.html");
});

// REGISTER - Signup
router.get("/create.html", function(req, res) {
    res.render("create");
});

// SIGNIN - login
router.post("/welcome.html", function(req, res) {
    res.redirect("/homepage.html");
});

router.post("/homepage.html", function(req, res) {
    // Extract values from the sent form
    var title = req.body.entryTitle;
    var content = req.body.entryContent;
    var date = req.body.entryDate;

    if (title !== '' || content !== '') {
        // Create a new journal entry
        var newEntry = {
            _id: uniqid(),
            title: title,
            content: content,
            timestamp: date
        }

        // Push the new journal entry into the array
        journalEntries.unshift(newEntry);
    }

    ejs.renderFile(__dirname + '/../views/journal_entry.ejs', {journalEntries: journalEntries}, function(err,str) {
        if (err) {
            res.send(err);
        } else {
            res.send(str);
        }
    })
});

// SHOW - Display the title and content of a journal entry
router.get("/homepage.html/:id", function(req, res) {
    var id = req.params.id;

    var journalEntry = journalEntries.filter((journalEntry) => {
        return (journalEntry._id == id);
    });

    res.send(journalEntry);
});

// UPDATE - Display the journal entry with modified content
router.put("/homepage.html/:id", function(req, res) {
    var title = req.body.entryTitle;
    var content = req.body.entryContent;
    var id = req.params.id;
    var index = journalEntries.findIndex((journalEntry) => {
        return journalEntry._id == id;
    });

    if (index >= 0) {
        journalEntries[index].title = title;
        journalEntries[index].content = content;
    }

    ejs.renderFile(__dirname + '/../views/journal_entry.ejs', {journalEntries: journalEntries}, function(err,str) {
        if (err) {
            res.send(err);
        } else {
            res.send(str);
        }
    })
});

// DELETE - Remove an entry from the journal entries
router.delete("/homepage.html/:id", function(req, res) {
    var id = req.params.id;
    var index = journalEntries.findIndex((journalEntry) => {
        return journalEntry._id == id;
    });

    if (index >= 0) {
        journalEntries.splice(index, 1);
    }

    ejs.renderFile(__dirname + '/../views/journal_entry.ejs', {journalEntries: journalEntries}, function(err,str) {
        if (err) {
            res.send(err);
        } else {
            res.send(str);
        }
    })
});

router.get("*", function(req, res) {
    var page = req.params.page;
    res.render("error", {page:page});
});

module.exports = router;
