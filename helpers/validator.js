var validator = require('validator');
var logger = require('../libs/log')(module);

module.exports = function Validator() {
    if (!(this instanceof Validator)) {
        return new Validator();
    }

    this.forPicture = function (picture) {
        if (!picture || !picture.size) {
            return null;
        }
        if (picture.type.indexOf('image') === -1) {
            throw new Error('Invalid image format');
        }

        return picture;
    };

    this.forUser = function (user, options, cb) {
        var role = options.role;
        var strict = options.strict;
        var err = {
            name: 'User validation',
            message: ''
        };

        var email = user.email;
        var phone = user.phone;
        var birthday = user.birthday;
        var name = user.name;
        var password = user.password;
        var aRequired = ['email', 'phone', 'name', 'password'];
        var aAll = aRequired.concat(['birthday', 'gender', 'address']);
        var i;

        //for security
        if (role !== 'ADMIN') {
            delete user.admin;
            delete user.created;
            delete user.carts;
            delete user.comments;
            delete user.role;
            delete user.lastVisited;
            delete user.status;
        }

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!user[aAll[i]]) {
                delete user[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!user[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        email ? (!validator.isEmail(email) ? err.message += 'Invalid email\n' : null) : null;

        phone ? (!isMobilePhone(phone) ? err.message += 'Invalid phone\n' : null) : null;

        birthday ? (!validator.isDate(birthday) ? err.message += 'Invalid birthday\n' : null) : null;

        name ? (name.length < 3 || name.length > 32 ? err.message += 'Invalid name\n' : null) : null;

        password ? (password.length < 6 ? err.message += 'Invalid password length\n' : null) : null;

        err = err.message.length > 0 ? err : null;
        if (cb) {
            cb(err);
        } else {
            if (err) {
                logger.debug(err);
                throw err;
            }
        }
    };

    this.forProduct = function (product, options) {
        var strict = options.strict;
        var err = {
            name: 'Product validation',
            message: ''
        };

        var name = product.name;
        var category = product.category;
        var price = product.price;
        var producer = product.producer;
        var count = product.count;
        var description = product.description;

        var aRequired = ['name', 'price'];
        var aAll = aRequired.concat(['category', 'producer', 'count', 'description']);
        var i;

        delete product.comments;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!product[aAll[i]]) {
                delete product[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!product[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        price ? (price < 0 ? err.message += 'Invalid price\n' : null) : null;

        count ? (count < 0 ? err.message += 'Invalid count\n' : null) : null;

        isNaN(Number(price)) ? err.message += 'Invalid parameter price' : null;
        isNaN(Number(count)) ? err.message += 'Invalid parameter count' : null;

        if (err.message.length > 0) {
            logger.info('Invalid Product parameters ' + err.message);
            throw err;
        }
    };

    this.forProducer = function (producer, options) {
        var strict = options.strict;
        var err = {
            name: 'Producer validation',
            message: ''
        };

        var name = producer.name;
        var description = producer.description;

        var aRequired = ['name'];
        var aAll = aRequired.concat(['description']);
        var i;

        delete producer.products;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!producer[aAll[i]]) {
                delete producer[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!producer[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        if (err.message.length > 0) {
            logger.info('Invalid Producer parameters ' + err.message);
            throw err;
        }
    };

    this.forComment = function (comment, options) {
        var strict = options.strict;
        var err = {
            name: 'Comment validation',
            message: ''
        };

        var title = comment.title;
        var body = comment.body;

        var aRequired = ['product', 'title', 'body', 'user'];
        var aAll = aRequired;
        var i;
        
        delete comment.date;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!comment[aAll[i]]) {
                delete comment[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!comment[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        if (err.message.length > 0) {
            logger.info('Invalid Comment parameters ' + err.message);
            throw err;
        }
    };

    this.forCategory = function (category, options) {
        var strict = options.strict;
        var err = {
            name: 'Category validation',
            message: ''
        };

        var name = category.name;

        var aRequired = ['name'];
        var aAll = aRequired;
        var i;

        delete category.products;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!category[aAll[i]]) {
                delete category[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!category[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        if (err.message.length > 0) {
            logger.info('Invalid Category parameters ' + err.message);
            throw err;
        }
    };

    this.forCart = function (cart, options) {
        var strict = options.strict;
        var err = {
            name: 'Cart validation',
            message: ''
        };

        var products = cart.products;
        var shippedDate = cart.shippedDate;
        var address = cart.address;
        var user = cart.user;

        var aRequired = ['products', 'user', 'address'];
        var aAll = aRequired.concat(['shippedDate']);
        var i;

        delete cart.orderDate;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!cart[aAll[i]]) {
                delete cart[aAll[i]];
            }
        }

        if (products && !products[0]) {
            err.message += 'Nothing to buy';
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!cart[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        if (err.message.length > 0) {
            logger.info('Invalid Cart parameters ' + err.message);
            throw err;
        }
    };

    this.forAdmin = function (admin, options) {
        var strict = options.strict;
        var err = {
            name: 'Admin validation',
            message: ''
        };

        var firstName = admin.firstName;
        var lastName = admin.lastName;
        var address = admin.address;

        var aRequired = ['firstName', 'lastName'];
        var aAll = aRequired;
        var i;

        //for all
        for (i = 0; i < aAll.length; i++) {
            if (!admin[aAll[i]]) {
                delete admin[aAll[i]];
            }
        }

        //for required
        if (strict) {
            for (i = 0; i < aRequired.length; i++) {
                if (!admin[aRequired[i]]) {
                    err.message += aRequired[i] + ' is required\n';
                }
            }
        }

        if (err.message.length > 0) {
            logger.info('Invalid Admin parameters ' + err.message);
            throw err;
        }
    };
};

function isMobilePhone(num) {
    var phoneReg = /[\+]?[\d]{10,12}/;
    return phoneReg.test(num);
}
