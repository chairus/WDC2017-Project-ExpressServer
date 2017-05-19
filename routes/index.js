var express = require('express');
var router = express.Router();
var path = require('path');
var ejs = require('ejs');
var mariadb = require('../db/db-connect');

// Middleware to check if the user has logged in
function checkIsLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('warning', 'You need to be logged in');
    res.redirect('../');
}

// INDEX - Display the index/welcome page
router.get("/", function(req, res) {
    res.render("welcome", {
        success: req.flash('success'),
        warning: req.flash('warning')
    });
});

// SEARCH - Search journal entries of a user using a search term
router.get("/homepage.html/search", checkIsLoggedIn ,function(req, res) {
    var username = req.session.user.femail;
    // Replace all percent('%') characters to space(' ')
    var searchTerm = req.query.searchTerm.replace(/%/g, ' ');

    mariadb.query(`SELECT journal_entries.id, title, content, timestamp FROM journal_entries JOIN users ON journal_entries.user_id=users.id WHERE username="${username}" && (title LIKE "%${searchTerm}%" || content LIKE "%${searchTerm}%") ORDER BY timestamp DESC`, function(err, journalEntries) {
        if (err) {
            throw err;
        }
        ejs.renderFile(__dirname + '/../views/journal_entry.ejs', {
            journalEntries: journalEntries
        }, function(err, str) {
            if (err) {
                res.send(err);
            } else {
                res.send(str);
            }
        });
    });
});

router.get("/homepage.html", checkIsLoggedIn, function(req, res) {
    var username = req.session.user.femail;
    // Retrieve journal entries of the logged in user
    mariadb.query(`SELECT journal_entries.id, title, content, timestamp FROM journal_entries JOIN users ON journal_entries.user_id=users.id WHERE username="${username}" ORDER BY timestamp DESC`, function(err, journalEntries) {
        if (err) {
            throw err;
        }
        res.render("homepage", {
            journalEntries: journalEntries,
            user: username
        });
    });
});

// EDIT - Display the edit form by sending an XMLHttpRequest to the server
router.get("/homepage.html/new&nolayout", function(req, res) {
    res.sendFile(path.join(__dirname, '../views', 'entry_form.ejs'));
});

router.get("/homepage.html/new", function(req, res) {
    res.redirect("/homepage.html");
});

// REGISTER - Signup
router.get("/create.html", function(req, res) {
    res.render("create", {warning: req.flash('warning')});
});

// CREATE - Add a new journal entry
router.post("/homepage.html", checkIsLoggedIn, function(req, res) {
    // Extract values from the sent form
    var title = req.body.entryTitle.replace(/"/g, "'");
    var content = req.body.entryContent.replace(/"/g, "'");
    var username = req.session.user.femail;

    if (title !== '' || content !== '') {
        // Store the new journal entry into the DB
        mariadb.query(`INSERT INTO journal_entries(title, content, timestamp, user_id) VALUES("${title}", "${content}", NOW(), ${req.session.user.id})`, function(err, result) {
            if (err) {
                throw err;
            }
            retrieveJournalEntries(username, res);
        });
    } else {
        retrieveJournalEntries(username, res);
    }
});

// SHOW - Display the title and content of a journal entry
router.get("/homepage.html/:id", checkIsLoggedIn, function(req, res) {
    var id = req.params.id;

    // Retrieve the title and content of a journal entry
    mariadb.query(`SELECT title, content, user_id FROM journal_entries WHERE id="${id}"`, function(err, journalEntry) {
        if (err) {
            throw err;
        }
        // Check if the logged in user is the owner of the journal entry
        if (journalEntry.length > 0) {
            if (journalEntry[0].user_id == req.session.user.id) {
                delete journalEntry[0].user_id;
                return res.send(journalEntry);
            }
        }
        res.redirect('/homepage.html');
    });
});

// UPDATE - Display the journal entry with modified content
router.put("/homepage.html/:id", function(req, res) {
    var username = req.session.user.femail;
    var title = req.body.entryTitle.replace(/"/g, "'");
    var content = req.body.entryContent.replace(/"/g, "'");
    var id = req.params.id;

    mariadb.query(`UPDATE journal_entries SET title="${title}", content="${content}" WHERE id="${id}"`, function(err, result) {
        if (err) {
            throw err;
        }
    });

    retrieveJournalEntries(username, res);
});

// DELETE - Remove an entry from the journal entries
router.delete("/homepage.html/:id", function(req, res) {
    var id = req.params.id;
    var username = req.session.user.femail;

    mariadb.query(`DELETE FROM journal_entries WHERE id="${id}"`, function(err, result) {
        if (err) {
            throw err;
        }
        retrieveJournalEntries(username, res);
    });
});

function retrieveJournalEntries(username, res) {
    mariadb.query(`SELECT journal_entries.id, title, content, timestamp FROM journal_entries JOIN users ON journal_entries.user_id=users.id WHERE username="${username}" ORDER BY timestamp DESC`, function(err, journalEntries) {
        if (err) {
            throw err;
        }
        ejs.renderFile(__dirname + '/../views/journal_entry.ejs', {
            journalEntries: journalEntries
        }, function(error, str) {
            if (error) {
                res.send(error);
            } else {
                res.send(str);
            }
        });
    });
}

module.exports = router;
