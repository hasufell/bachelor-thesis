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
var outbound = require('./outbound');



exports.hook_data_post = function(next, connection) {

    // if we have a myst mail, we need to inject our Protocol
    if (is_myst_mail(connection.transaction.header)) {
        // we decrypt the mail body and treat it as raw mail data
        var decrypted_email = myst_decrypt(connection.transaction.body.bodytext);

        // replace the current transaction object with the new one based
        // on the decrypted_mail
        var t = transform_transaction(decrypted_email, connection);
        connection.transaction = t;

        // the unpacked mail is a myst mail too, this means we have to relay it,
        // otherwise it's handled by the normal haraka delivery methods
        if (is_myst_mail(connection.transaction.header)) {
            connection.relaying = true;
        }
    }

    // let the other handlers do what they want, we are finished injecting
    // our logic, the rest is still SMTP compliant
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
    var to_addr = t.header.get("To").match(/[^@<\s]+@[^@\s>]+/g);
    var addresses = [];
    for (i = 0; i < to_addr.length; i++) {
        addresses.push(new Address(to_addr[i]));
    }

    t.mail_from = new Address(from_addr);
    t.rcpt_to = addresses;
    t.results.store.mail_from = new Address(from_addr);
    t.results.store.rcpt_to = addresses;

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


/**
 * Decrypts the whole mail and return
 *
 * @param {string} string encrypted string
 * @return {string} the decrypted string
 */
function myst_decrypt(string) {
    var b = new Buffer(string, 'base64').toString('utf8');
    return b;
}


function send_myst_mail(email, connection) {
    var email_lines = email.split("\n");

    // create transaction for our mail, to make use of the internal parser
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

    // use old result object, otherwise we get errors
    t.results = connection.transaction.results;

    // finally get mail_from and rcpt_to
	// TODO: support multiple recipients for last hop
    var from_addr = t.header.get("From").match(/[^@<\s]+@[^@\s>]+/g)[0];
    var to_addr = t.header.get("To").match(/[^@<\s]+@[^@\s>]+/g);

	var outnext = function(code, msg) {
		next(OK);
	}

	// send mail
    for (i = 0; i < to_addr.length; i++) {
        outbound.send_email(from_addr, to_addr[i], email, outnext);
    }
}
