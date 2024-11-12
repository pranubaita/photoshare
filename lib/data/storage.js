const fs = require("fs");

/**
 * This module contains the basic functions for managing JSON data conveniently in a file.
 * These functions are used by the database for actually reading and writing the data on the filesystem.
 */

SPACE = 4; // For saving the data in a readable format

function formatFilename(filename) {
    return `${filename}.json`;
}

/**
 * Read a JS object from a JSON file.
 */
function read(file) {
    return JSON.parse(fs.readFileSync(formatFilename(file)));
}

/**
 * Write a JS object into a JSON file.
 */
function write(file, data) {
    fs.writeFileSync(formatFilename(file), JSON.stringify(data, null, SPACE));
}

/**
 * Update a JS object stored in a JSON file.
 *
 * The `update` parameter is a function that receives the currently stored data,
 * manipulates it in whatever way, and returns the updated data to be stored.
 */
function update(file, update) {
    const updated = update(read(file));
    write(file, updated);
    return updated;
}

/**
 * Create and write a JS object into a JSON file, if the file does not exist.
 */
function initialize(file, data) {
    if (!fs.existsSync(formatFilename(file))) {
        write(file, data);
    }
}

module.exports = { read, write, update, initialize };
