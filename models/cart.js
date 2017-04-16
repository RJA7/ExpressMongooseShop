var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var relationship = require('mongoose-relationship');

var CartSchema = Schema({
    products: [{ 
        type: ObjectId, 
        ref: 'product',
        childPath: 'carts',
        required: [true, 'product is required']
    }],

    productsObj: [],
    
    totalPrice: Number,
    
    orderDate: { 
        type: Date, 
        default: Date.now() 
    },
    
    shippedDate: Date,
    
    address: {
        type: String,
        required: true
    },
    
    user: { 
        type: ObjectId, 
        ref: 'user',
        childPath: 'carts',
        required: [true, 'user is required']
    }
});

CartSchema.plugin(relationship, { relationshipPathName: 'user' });
CartSchema.plugin(relationship, { relationshipPathName: 'products' });

var Cart = mongoose.model('cart', CartSchema);

module.exports = Cart;
