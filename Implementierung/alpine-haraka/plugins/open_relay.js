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

'use strict';


var console = require('console');
var Body = require('./mailbody').Body;


/**
 * This acts as an open relay for non-local recipients
 */
exports.hook_rcpt = function(next, connection, params) {
	if (is_local_rcpt(connection) == false) {
		connection.relaying = true;
	}
	return next(OK);
}


function is_local_rcpt(connection) {
	// TODO: get "rcpt.haraka" from the config files
	// TODO: we currently only handle one recipient
	if (connection.transaction.rcpt_to[0].host == "rcpt.haraka") {
		return true;
	}
	return false;
}

