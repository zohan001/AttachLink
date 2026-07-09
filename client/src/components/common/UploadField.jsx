import { useState, useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";

export default function UploadField({ folder, accept = "image/*,.pdf,.doc,.docx", onUpload, currentUrl, label }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpload(res.data.data.url, res.data.data.publicId);
      toast.success("Upload successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isImage = currentUrl && /\.(jpg|jpeg|png|webp|gif|svg)/i.test(currentUrl);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center gap-4">
        {currentUrl ? (
          <div className="relative group">
            {isImage ? (
              <img src={currentUrl} alt="" className="w-20 h-20 object-cover rounded-lg border" />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border">
                <FileText size={32} className="text-gray-400" />
              </div>
            )}
            <button
              type="button"
              onClick={() => onUpload("", "")}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <UploadCloud size={18} />
          {uploading ? "Uploading..." : "Choose file"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
