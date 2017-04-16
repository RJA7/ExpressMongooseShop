var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var relationship = require('mongoose-relationship');

var AdminSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required']
    },

    lastName: {
        type: String,
        required: [true, 'lastName is required']
    },

    address: {
        type: String,
        required: [true, 'address is required']
    },

    user: {
        type: ObjectId,
        ref: 'user',
        childPath: 'admin',
        required: [true, 'user is required']
    }
});

AdminSchema.plugin(relationship, { relationshipPathName: 'user' });

var Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
