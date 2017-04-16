var mongoose = require('mongoose');
var Category = require('./models/category');
var Producer = require('./models/producer');
var User = require('./models/user');
var Admin = require('./models/admin');
var Product = require('./models/product');
var Comment = require('./models/comment');
var Cart = require('./models/cart');

mongoose.connect('mongodb://127.0.0.1:27017/shoptest');

clear();
setTimeout(fill, 1000);

function clear() {
    Category.remove({}, function() {
        console.log('Categories removed');
    });

    Producer.remove({}, function() {
        console.log('Producers removed');
    });

    User.remove({}, function() {
        console.log('Users removed');
    });

    Admin.remove({}, function() {
        console.log('Admins removed');
    });

    Product.remove({}, function() {
        console.log('Products removed');
    });

    Cart.remove({}, function() {
        console.log('Carts removed');
    });

    Comment.remove({}, function() {
        console.log('Comments removed');
    });
}

function fill() {
    var categories = ['notebooks', 'telephones', 'televisions', 'playstation', 'laptops', 'kits', 'smartphones', 'processors', 'batteries', 'mouses'];
    var producers = ['Sumsung', 'LG', 'Nokia', 'ASUS', 'Apple', 'Acer', 'Dell', 'Toshiba', 'Lenovo', 'Siemens'];

    var category = [];
    var producer = [];
    var user = [];
    var admin = [];
    var product = [];
    var cart = [];
    var comment = [];
    var i;

    setTimeout(f1, 0);
    setTimeout(f2, 1000);
    setTimeout(f3, 2000);
    setTimeout(f4, 3000);
    setTimeout(f5, 4000);
    setTimeout(f6, 5000);
    setTimeout(f7, 6000);

    function f1() {
        for(i = 0; i < 10; i++) {
            category[i] = new Category();
            category[i].name = categories[i];
            category[i].save();
        }
        console.log('Categories created');
    }

    function f2() {
        for (i = 0; i < 10; i++) {
            producer[i] = new Producer();
            producer[i].name = producers[i];
            producer[i].description = 'producer ' + i + ' description';
            producer[i].save();
        }
        console.log('Producers created');
    }

    function f3() {
        for (i = 0; i < 100; i++) {
            user[i] = new User();
            user[i].email = 'email' + i + '@i.ua';
            user[i].phone = '+38097578739' + i;
            user[i].birthday = new Date(1992, i % 11, i % 28 + 1);
            user[i].name = 'namer' + i;
            user[i].password = 'password' + i;
            user[i].created = Date.now() - i * 10000;
            user[i].gender = 'Male';
            user[i].address = 'address';
            user[i].save();
        }
        console.log('Users created');
    }

    function f4() {
        admin = new Admin();
        admin.firstName = 'Roma';
        admin.lastName = 'RJA';
        admin.address = 'Lviv';
        admin.user = user[0];
        user[0].role = 'ADMIN';
        user[0].verified = true;
        user[0].password = '1q2w3e';
        user[0].phone = process.env.ownerPhone || '0976543210';
        user[0].email = process.env.EMAIL || 'adminEmailNotSet@gmail.com';
        user[0].save();
        admin.save();

        console.log('Admins created');
    }

    function f5() {
        for (i = 0; i < 100; i++) {
            product[i] = new Product();
            product[i].name = 'product' + i + 'name';
            product[i].category = category[i % 10];
            product[i].price = 1 + i * 100;
            product[i].producer = producer[i % 10];
            product[i].count = i;
            product[i].description = 'description' + i;
            product[i].save();
        }
        console.log('Products created');
    }

    function f6() {
        for (i = 0; i < 100; i++) {
            cart[i] = new Cart();
            cart[i].products.push(product[i]);
            cart[i].products.push(product[99 - i]);
            cart[i].user = user[i % 10];
            cart[i].orderDate = Date.now() - i * 10000;
            cart[i].address = 'address';
            cart[i].save();
        }
        console.log('Carts created');
    }

    function f7() {
        for (i = 0; i < 100; i++) {
            comment[i] = new Comment();
            comment[i].product = product[i];
            comment[i].title = 'title' + i;
            comment[i].body = 'body' + i;
            comment[i].user = user[i % 10];
            comment[i].save();
        }
        console.log('Comments created');
    }
}
