import cloudinary from "../../../config/cloudinary.js";

class UploadController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file provided" });
      }

      const folder = req.body.folder || "general";

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `attachlink/${folder}`, resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).json({ success: false, message: "publicId is required" });
      }

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ success: true, message: "File deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
