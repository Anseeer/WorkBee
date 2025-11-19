interface ConfirmModalProps {
    title?: string;
    message?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmModal({
    title = "Are you sure?",
    message = "Please confirm this action.",
    confirmText = "Confirm",
    onCancel,
    onConfirm,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4 border">
                
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {title}
                </h3>

                <p className="text-gray-600 text-center text-sm">
                    {message}
                </p>

                <div className="flex justify-end gap-3 pt-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-xl border bg-gray-100 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
}
