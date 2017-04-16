var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var defaultPictureUrl = '/images/categories/default.jpg';

var CategorySchema = Schema({
    name: { 
        type: String, 
        required: [true, 'name is required']
    },
    
    picturePath: {
        type: String,
        default: defaultPictureUrl
    },
    
    products: [{ 
        type: ObjectId, 
        ref: 'product' 
    }]
});

var Category = mongoose.model('category', CategorySchema);

module.exports = Category;
