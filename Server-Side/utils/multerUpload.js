const multer = require("multer");

const multerUpload = (path, filedName) => {
  const multerStorage = multer.diskStorage({
    destination: `public/${path}`,
    filename: (req, file, cb) => {
      cb(
        null,
        `event-${Math.floor(
          1000000 + Math.random() * 9000000
        ).toString()}-${Date.now()}.jpeg`
      );
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload.single(filedName);
};

module.exports = multerUpload;
