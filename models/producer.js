var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var image = require('../helpers/imager')();

var pictureBaseUrl = '/images/producers';
var defaultPictureUrl = pictureBaseUrl + '/default.jpg';
var option = { width: 100, height: 100 };

var ProducerSchema = Schema({
    name: { 
        type: String, 
        required: [true, 'name is required']
    },
    
    description: { 
        type: String 
    },
    
    picturePath: { 
        type: String, 
        default: defaultPictureUrl,
        set: saveImage
    },
    
    products: [{ 
        type: ObjectId, 
        ref: 'product' 
    }]
});

var Producer = mongoose.model('producer', ProducerSchema);

module.exports = Producer;


function saveImage(oImage) {
    image.crop(oImage, option);
    return image.save(oImage, pictureBaseUrl);
}
