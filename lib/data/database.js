const path = require("path");

const storage = require("./storage");
const { validateSchema } = require("./integrity");

/**
 * A database is a data type that represents a data store, where one can store lists of objects and manipulate them easily.
 *
 * For curious students - what you see before you is called a "class declaration",
 * which is a way to introduce new data types of our own (like strings, numbers, arrays, etc. but a new one we invented!).
 * This is useful when one wants to conveniently represent some type of object in their code.
 * A custom class lets us define which attributes and methods the new data type will have.
 *
 * A database instance is initialized with respect to a given directory (see example below).
 * The DB will manage a separate storage file for every collection in the specified directory.
 *
 * A database object exposes 5 methods, which you can use to manipulate the objects stored in your collections.
 * These methods are: fetchAll, fetchOne, create, update, delete. See their documentation below.
 *
 * Besieds that: database instances also have some getters (methods that look like regular attributes) and private methods, that start
 * with # (these can only be used from within other methods of the class). If you are curious, you can read more online :)
 */
class DataBase {
    #directory;

    constructor(directory) {
        this.#directory = directory;
    }

    get directory() {
        return this.#directory;
    }

    #collectionPath(collection) {
        return path.join(this.directory, collection.name);
    }

    #loadCollection(collection) {
        return storage.read(this.#collectionPath(collection));
    }

    #updateCollection(collection, update) {
        return storage.update(this.#collectionPath(collection), update);
    }

    #autoincrement(collection, object) {
        const autoincrementedProps = collection.autoincremented;
        if (autoincrementedProps.length) {
            const allObjects = this.fetchAll(collection);
            const newPropValues = Object.fromEntries(
                autoincrementedProps.map((prop) => {
                    const existingValues = allObjects.map((obj) => obj[prop.name]);
                    const maxValue = existingValues.length ? Math.max(...existingValues) : 0;
                    return [prop.name, maxValue + 1];
                })
            );
            return { ...object, ...newPropValues };
        }
        return object;
    }

    /**
     * Initialize empty storage files for the given collections, if they do not already exist.
     */
    initialize(collections) {
        collections.forEach((collection) => {
            storage.initialize(this.#collectionPath(collection), {});
        });
    }

    /**
     * Fetch all stored objects from a given collection.
     */
    fetchAll(collection) {
        return Object.values(this.#loadCollection(collection));
    }

    /**
     * Fetch a specific stored object with a given ID from a given collection.
     * The object is accessed via its primary property.
     *
     * The `strict` option, when `true`, will throw an error if the requested object doesn't exist.
     * Otherwise, `undefined` is returned.
     */
    fetchOne(collection, id, strict) {
        const existing = this.#loadCollection(collection)[id];
        if (strict && !existing) {
            throw Error(`No ${collection.name} ${id} exist!`);
        }
        return existing;
    }

    /**
     * Store a new object in a given collection.
     * The given object will be verified to comply with the specifications and constraints of the collection.
     */
    create(collection, object) {
        validateSchema(object, collection, this);
        object = this.#autoincrement(collection, object);
        this.#updateCollection(collection, (data) => ({
            ...data,
            [object[collection.primary]]: object,
        }));
    }

    /**
     * Update a stored object with a given ID in a given collection.
     * The object is accessed via its primary property.
     *
     * The update is performed by passing the `patch` parameter, which maps new values to
     * exising keys (collection properties) of the stored object.
     * For example, passing {last_name: "bla", bio: "I'm fine"} will update the bio and last_name of the requested object.
     * The provided patch is of course verified to comply with collection specs and constraints.
     *
     * An error will be thrown if the requested object does not exist.
     */
    update(collection, id, patch) {
        validateSchema(patch, collection, this, true);
        const existing = this.fetchOne(collection, id, true);
        this.#updateCollection(collection, (data) => ({
            ...data,
            [id]: { ...existing, ...patch },
        }));
    }

    /**
     * Delete a stored object with a given ID from a given collection.
     * The object is accessed via its primary property.
     *
     * The `strict` option, when `true`, will throw an error if the requested object doesn't exist.
     * Otherwise, nothing happens.
     */
    delete(collection, id, strict) {
        if (strict) {
            this.fetchOne(collection, id, true);
        }
        this.#updateCollection(collection, ({ [id]: _, ...rest }) => rest);
    }
}

/**
 * Initialize a new database that manages the given collections in the given directory.
 */
function initialize(collections, directory) {
    const db = new DataBase(directory || ".");
    db.initialize(collections);
    return db;
}

module.exports = { initialize };
