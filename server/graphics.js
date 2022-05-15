var fs = require('fs'),
    gm = require('gm'),
    path = require('path');

var dir = path.join(__dirname, '../client/public/');
function createImage(text, email) {
    console.log(dir);
    gm(150, 100, '#84defaaa')
        .fontSize(68)
        .stroke('#efe', 3)
        .fill('#000000')
        .drawText(20, 72, text)
        .write(dir + email + '.png', function (err) {
            if (err) return console.dir(arguments);
            console.log(this.outname + ' created  :: ' + arguments[3]);
        });
}

module.exports = {
    createImage,
};
