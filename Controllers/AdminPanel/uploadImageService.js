const express = require("express");
const pool = require("../../dbConnection");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const coverStorage = multer.diskStorage({
  destination(req, file, cb) {
    // Update the destination path as needed
    cb(
      null,
      path.join(
        __dirname,
        // "../../../../../OSMS/frontend/osms-frontend/src/Resources/Images/"
        process.env.PROMOTION_PATH
      )
    );
  },
  filename(req, file, cb) {
    console.log(file);
    // Update the filename generation logic if needed
    cb(null, `promotion_${file.originalname}`);
  },
});

const coverUpload = multer({ storage: coverStorage });

router.post("/", coverUpload.single("file"), async (req, res, next) => {
  const fileInfo = req.file;

  if (fileInfo) {
    const {
      originalname,
      size,
      mimetype,
      filename,
      path: destination,
    } = fileInfo;

    try {
      const result = await pool.query(
        "INSERT INTO public.promotion(original_name, size, type, file_name, path) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [originalname, size, mimetype, filename, destination]
      );

      console.log(result.rows);
      res
        .status(200)
        .send({ message: "Uploaded successfully!", value: result.rows[0] });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  } else {
    res.status(400).send({ message: "File not provided or upload failed!" });
  }
});

module.exports = router;
