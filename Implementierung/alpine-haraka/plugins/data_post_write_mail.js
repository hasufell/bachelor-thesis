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
var fs = require('fs');
var os = require('os');

var Address = require('./address').Address;
var Transaction = require('./transaction').Transaction;
var MessageStream = require('./messagestream');
var config = require('./config');
var uuid        = require('./utils').uuid;


var tempDir = os.tmpdir();

// write mail to /tmp/mail.eml
exports.hook_data_post = function(next, connection) {
    var ws = fs.createWriteStream(tempDir + '/mail.eml');
    ws.once('close', function () {
        return next(OK);
    });
    connection.transaction.message_stream.pipe(ws);
};


