/*
Haraka Plugins for SMTP-based anonymization
Copyright (C) 2016 Julian Ospald

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

var console = require('console');
var fs      = require('fs');
var os      = require('os');

var Address       = require('./address').Address;
var MessageStream = require('./messagestream');
var Transaction   = require('./transaction').Transaction;
var config        = require('./config');
var uuid          = require('./utils').uuid;




exports.hook_data_post = function(next, connection) {

	var mail = create_myst_mail(connection.transaction);
	var t = transform_transaction(mail, connection);
	connection.transaction = t;

    next();
}


/**
 * Transforms the current transaction based on a given
 * raw email string. This always parses the body.
 *
 * 'mail_from' and 'rcpt_to' are filled in from the email headers.
 * The uuid and results are taken from the old transaction.
 *
 * @param {string} email the raw full email, including headers
 * @param {Connection} connection the current connection object
 * @return {Transaction} the new transaction
 */
function transform_transaction(email, connection) {
    var email_lines = email.split("\n");

    // create new empty transaction
    var t = new Transaction();
    t.uuid = connection.transaction.uuid;
    t.parse_body = true;
    t.message_stream = new MessageStream(
            config.get('smtp.ini'), t.uuid,
            t.header.header_list);

    // parse the email and fill the object
    var i;
    for (i = 0; i < email_lines.length; i++) {
        t.add_data(email_lines[i] + "\n");
    }
    t.end_data(function() { return ; })

    // use old result object
    t.results = connection.transaction.results;

    // overwrite mail_from and rcpt_to
    var from_addr = t.header.get("From").match(/[^@<\s]+@[^@\s>]+/g)[0];
    var to_addr = t.header.get("To").match(/[^@<\s]+@[^@\s>]+/g)[0];
    t.mail_from = new Address(from_addr);
    t.rcpt_to = [new Address(to_addr)];
    t.results.store.mail_from = new Address(from_addr);
    t.results.store.rcpt_to = [new Address(to_addr)];

    return t;
}


/**
 * Check whether the given header object identifies as a myst mail header
 *
 * @param {Header} header
 * @return {Boolean} true/false
 */
function is_myst_mail(header) {
    if (header.get("X-Myst")) {
        return true;
    }

    return false;
}



function myst_encrypt(string) {
	var enc = new Buffer(string).toString('base64');

	return enc;
}


function get_hops() {
	// excludes the last hop
	return ["hop1.haraka", "hop2.haraka", "hop3.haraka"];
}


// TODO: randomize date?
function create_mail_for_hop(fromd, tod, date, bodytext) {
	var from_addr = "myst@" + fromd;
    var to_addr = "myst@" + tod;

	return ["Date: " + date,
		"To: " + to_addr,
		"From: " + from_addr,
		"X-Myst: 1",
		"Subject: ",
		"",
		myst_encrypt(bodytext),
		""].join("\n");
}


function create_myst_mail(transaction) {
	// recipient is always the last hop
    var recipient = transaction.rcpt_to[0].host;
	var hops = get_hops();
	hops.push(recipient);

	var date = transaction.header.get("Date").replace(/\n$/, "");

	// innermost mail, untouched
	var old_mail = get_raw_mail(transaction.body);

	var i;
	var new_mail = old_mail;
	for (i = hops.length - 1; i >= 0; i--) {
		if (i == 0) {
			// first hop, "from" must be the actual sender
			var sender = transaction.mail_from.host;
			new_mail = create_mail_for_hop(sender, hops[i], date, new_mail);
		} else {
			new_mail = create_mail_for_hop(hops[i-1], hops[i], date, new_mail);
		}
	}

	return new_mail;
}


function get_raw_mail(body) {
	// TODO: doesn't handle multipart mime
	return body.header.header_list.join("") + "\n" + body.bodytext;
}
