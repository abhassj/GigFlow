import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isLoading = false }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-dark-card border border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-300 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-white/5 flex gap-3 justify-end">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent-purple text-white font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative z-10">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : confirmText}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
