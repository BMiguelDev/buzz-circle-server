const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

// Create a string containing the current formatted date, a unique id, and the log message, and append it to the 'logFileName' file
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);   // Log item to the console so we can see requests on the server's host platform

    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch(err) {
        console.error(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.headers.origin}\t${req.method}\t${req.url}`, 'reqLog.txt');
    next();
}

module.exports = { logEvents, logger };
