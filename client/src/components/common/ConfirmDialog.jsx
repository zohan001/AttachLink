import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || "Confirm"} size="sm">
      <p className="text-gray-600 mb-6">{message || "Are you sure?"}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
}
