/**
 * A collection is a data type that can be stored in the database.
 * 
 * For curious students - what you see before you is called a "class declaration",
 * which is a way to introduce new data types of our own (like strings, numbers, arrays, etc. but a new one we invented!).
 * This is useful when one wants to conveniently represent some type of object in their code.
 * A custom class lets us define which attributes and methods the new data type will have.
 * 
 * The attributes of a collection are:
 * - name:  The name of the collection (e.g. "users").
 *          This will be used, for example, as the name of the JSON file that will store objects of this type.
 * - props: An array of data properties for this collection (e.g. "first_name", "email", "password", ...).
 *          This defines the sort of data that will be stored in the DB for each object of this collection.
 * 
 * Collections also have some getters (methods that look like regular attributes) and private methods, that start
 * with # (these can only be used from within other methods of the class). If you are curious, you can read more online :)
 * 
 * Initializing a new collection instance (see /lib/data/index.js for relevant examples) means defining a new type of
 * data that can be stored in a database in the form of objects with a specified form. The specification of the form
 * of data objects in this collection is done by configuring the collection properties.
 */
class Collection {
    constructor(name, properties) {
        this.name = name;
        this.props = properties;

        this.#validateName();
        this.#validatePrimary();
        this.#validateDuplicates();
    }

    get primary() {
        return this.props.find((prop) => prop.primary).name;
    }

    get fields() {
        return this.props.map((prop) => prop.name);
    }

    get schema() {
        return Object.fromEntries(this.props.map((prop) => [prop.name, prop]));
    }

    get autoincremented() {
        return this.props.filter((prop) => prop.autoincrement);
    }

    has(name) {
        return this.fields.includes(name);
    }

    #validateName() {
        if (!this.name || this.name.split(/\W/).length > 1) {
            throw Error("Collection names must be a single word built of alphanumeric characters!");
        }
    }

    #validateDuplicates() {
        const unique = new Set(this.fields);
        if (unique.size < this.props.length) {
            throw Error(`Duplicate properties are not allowed!`);
        }
    }

    #validatePrimary() {
        const primaryCount = this.props.filter((prop) => prop.primary).length;
        if (primaryCount !== 1) {
            throw Error(`${this.name} must have 1 primary field, but ${primaryCount} were given!`);
        }
    }
}

const SUPPORTED_TYPES = [String, Number, Boolean];

/**
 * Represents a collection data property, which is a piece of information about an object (e.g. a user, post, ...)
 * that will be stored in the database.
 * 
 * Properties also define constraints on the possible values the data can have.
 * For example, user emails must be unique, post captions are optional, timestamps must be numeral, and so on.
 * 
 * Properties have the following attributes:
 * - name:          The name of the property (e.g. "last_name", "likes", etc.)
 * - type:          Constrains the type of the property.
 *                  This means the value saved in the DB for the property must be of this type.
 *                  As an example, usernames must be strings.
 * - optional:      Determines whether the property value can be empty.
 *                  For example, user bio may be left empty, but usernames must have a value.
 *                  By default properties are not optional.
 * - unique:        Determines whether the property value must be unique.
 *                  For example, no two users can have the same username.
 *                  By default properties are not unique.
 * - multiple:      Detemines whether the property should store an array of values.
 *                  For example, one could store a users' favorite colors that way (["red", "violet", ...]).
 *                  By default properties are single-valued.
 * - autoincrement: Determines whether the value of this property is just a number that is automatically incremented by 1
 *                  for every new object.
 *                  This is useful for generating unique IDs for objects, if there is no other meaningful way to uniquely
 *                  identify them (like comments or events, in contrast to users that have unique usernames).
 *                  By default properties are not auto-incremented.
 *                  A property that is auto-incremented cannot be manually set. The DB sets it automatically.
 * - primary:       Determines whether the property is the primary property of objects from the collection.
 *                  A primary property essentially acts like a unique ID of an object.
 *                  Each collection must have one primary property, which will be used to efficiently identify collection objects.
 *                  A primary might be a user's username, a post's image URL, or an auto-incremented arbitrary number.
 */
class Property {
    constructor(name, type, { optional, unique, primary, multiple, autoincrement } = {}) {
        this.name = name;
        this.type = type;
        this.unique = unique || primary;
        this.primary = primary;
        this.optional = optional;
        this.multiple = multiple;
        this.autoincrement = autoincrement;

        this.#validate();
    }

    #validate() {
        if (this.primary && this.optional) {
            throw Error(`Property ${this.name} cannot be both primary and optional!`);
        }

        if (this.multiple && this.unique) {
            throw Error(`Property ${this.name} cannot be both multiple and unique!`);
        }

        if (!SUPPORTED_TYPES.includes(this.type)) {
            const supportedTypeNames = SUPPORTED_TYPES.map((type) => type.name);
            throw Error(`Property ${this.name} is of type ${this.type}, but only ${supportedTypeNames} are supported!`);
        }

        if (this.autoincrement && this.multiple) {
            throw Error(`Property ${this.name} cannot be both multiple and autoincremented!`);
        }

        if (this.autoincrement && this.type !== Number) {
            throw Error(`Property ${this.name} must be of type Number to be autoincremented!`);
        }
    }
}

module.exports = { Collection, Property };
