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
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border p-6 animate-fadeInUp">

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 text-center tracking-wide">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="min-w-[110px] px-5 py-2.5 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 
                               hover:bg-gray-200 active:scale-95 transition-all font-medium shadow-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="min-w-[110px] px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold 
                               hover:bg-green-700 active:scale-95 transition-all shadow-md"
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );

}
