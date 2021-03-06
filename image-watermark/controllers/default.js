var Path = require('path');

exports.install = function() {
	F.route('/', view_index);

	// the number is maximum data receive
	F.route('/', view_index, ['upload'], 100); // max 100 kB
};

function view_index() {

	var self = this;
	var model = { info: '...' };

	var file = self.files[0];
	if (self.files.length === 0 || !file.isImage()) {
		self.view('index', model);
		return;
	}

	// file.isAudio();
	// file.isVideo();
	// file.isImage();

	model.info = file.filename + ' ({0} kB) - {1}x{2}'.format(Math.floor(file.length / 1024, 2), file.width, file.height);

	// =============================
	// $ brew install graphicsmagick
	// =============================

	var filename = F.path.public('upload.jpg');

	// Documentation: http://docs.totaljs.com/FrameworkImage/
	var image = file.image();

	image.watermark(F.path.public('watermark.png'), 20, 80, 100, 40);

	// IMPORTANT: see here https://github.com/petersirka/total.js/tree/master/examples/routing
	image.resizeCenter(300, 300).save(filename, function(err) {
		console.log(err);
		model.url = '<div><img src="/{0}?ts={1}" width="300" height="300" alt="Uploaded image" /></div><br />'.format(U.getName(filename), new Date().getTime());
		self.view('index', model);
	});

}