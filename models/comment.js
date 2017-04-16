var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var relationship = require('mongoose-relationship');

var CommentSchema = Schema({
    product: { 
        type: ObjectId, 
        ref: 'product',
        childPath: 'comments',
        required: [true, 'product is required']
    },
    
    title: { 
        type: String, 
        required: [true, 'title is required']
    },
    
    body: { 
        type: String, 
        required: [true, 'body is required']
    },
    
    user: { 
        type: ObjectId, 
        ref: 'user', 
        childPath: 'comments',
        required: [true, 'user is required']
    },
    
    date: {
        type: Date,
        default: Date.now()
    }
});

CommentSchema.plugin(relationship, { relationshipPathName: 'user' });
CommentSchema.plugin(relationship, { relationshipPathName: 'product' });

var Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
