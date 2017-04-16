var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var relationship = require('mongoose-relationship');

// '/public...'
var defaultPictureUrl = '/images/products/default.jpg';

//Parent for Comment. Child for Category, Producer, Cart
var ProductSchema = Schema({
    name: {
        type: String,
        required: true
    },
    
    category: { 
        type: ObjectId, 
        ref: 'category', 
        childPath: 'products'
    },

    picturePath: {
        type: String, 
        default: defaultPictureUrl
    },
    
    /*bigPicturePaths: { 
        type: [String]
    },*/
    
    price: { 
        type: Number, 
        required: [true, 'price is required'],
        validate: function(val) {return val > 0; }
    },
    
    producer: { 
        type: ObjectId, 
        ref: 'producer',
        childPath: 'products' 
    },
    
    count: { 
        type: Number,
        default: 0 
    },
    
    description: String,
    
    comments: [{ 
        type: ObjectId, 
        ref: 'comment'
    }],
    
    carts: [{
        type: ObjectId,
        ref: 'cart'
    }]
});

ProductSchema.plugin(relationship, { relationshipPathName: 'category' });
ProductSchema.plugin(relationship, { relationshipPathName: 'producer'});

var Product = mongoose.model('product', ProductSchema);

module.exports = Product;
