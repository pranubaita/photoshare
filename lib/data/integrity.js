function sameElements(arr1, arr2) {
    const combinedSet = new Set([...arr1, ...arr2]);
    return combinedSet.size === arr1.length && arr1.length === arr2.length;
}

function checkFieldsExact(object, collection) {
    const relevantFields = collection.props.filter((prop) => !prop.autoincrement).map((prop) => prop.name);
    if (!sameElements(Object.keys(object), relevantFields)) {
        throw Error(`${collection.name} must have the following fields: ${relevantFields}`);
    }
}

function checkFieldsSubset(object, collection) {
    for (const field in object) {
        if (!collection.has(field)) {
            throw Error(`Unknown field ${field} for ${collection.name}!`);
        }
    }
}

function checkOptional(object, prop) {
    if (!prop.optional && !prop.autoincrement && !object[prop.name]) {
        throw Error(`Missing value for ${prop.name}!`);
    }
}

function checkType(object, prop) {
    const value = object[prop.name];
    const isTypeValid = prop.multiple
        ? value?.every?.((item) => item.constructor === prop.type)
        : value?.constructor === prop.type;
    if (!isTypeValid) {
        throw Error(`${prop.name} must be of type ${prop.type.name}!`);
    }
}

function checkUnique(object, field, allObjects) {
    for (const existingObject of allObjects) {
        if (existingObject[field] === object[field]) {
            throw Error(`${field} ${object[field]} is already taken!`);
        }
    }
}

/**
 * This function makes sure that a given object matches the specifications of a given collection
 * before being inserted or updated in the storage file of that collection.
 * This ensures all stored objects have a rigid and predictable form, and saves you a lot of bugs!
 *
 * The validation procedure includes:
 * - Checking that the object has the properties each collection member must have
 * - Checking that the value of each property is of the correct type
 * - Checking that non-optional properties have a non-empty value
 * - Checking that unique properties don't have a value that already exists in
 *   the storage for some other object
 */
function validateSchema(object, collection, engine, partial) {
    let allObjects = null;
    const schema = collection.schema;
    partial ? checkFieldsSubset(object, collection) : checkFieldsExact(object, collection);
    for (const field in object) {
        const prop = schema[field];
        checkType(object, prop);
        checkOptional(object, prop);
        if (prop.unique) {
            allObjects = allObjects || engine.fetchAll(collection);
            checkUnique(object, field, allObjects);
        }
    }
}

module.exports = { validateSchema };
