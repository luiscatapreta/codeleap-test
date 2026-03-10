export default function SkeletonPost() {
    return (
        <div className="postCard skeleton-container">
            <div className="postHeader skeleton" style={{ height: '70px', borderRadius: '0' }} />
            <div className="postBody">
                <div className="postMeta">
                    <div className="skeleton" style={{ width: '100px', height: '18px' }} />
                    <div className="skeleton" style={{ width: '120px', height: '18px' }} />
                </div>
                <div className="skeleton" style={{ width: '100%', height: '18px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '90%', height: '18px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '40%', height: '18px' }} />
            </div>
        </div>
    );
}
