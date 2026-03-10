interface DeleteModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
    return (
        <div className="modalOverlay">
            <div className="modal">
                <h2 style={{ marginBottom: '40px' }}>Are you sure you want to delete this item?</h2>
                <div className="modalButtons">
                    <button className="btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
