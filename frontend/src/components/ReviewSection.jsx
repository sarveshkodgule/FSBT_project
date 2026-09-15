// Experiment 9: Data Fetching in React.js - Reviews
import { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={s <= value ? 'star filled clickable' : 'star clickable'}
        onClick={() => onChange(s)}
      >★</span>
    ))}
  </div>
);

const ReviewSection = ({ gameId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getForGame(gameId);
      setReviews(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) { setError('Please fill all fields'); return; }
    try {
      setSubmitting(true);
      setError('');
      await reviewsAPI.add(gameId, form);
      setForm({ rating: 5, title: '', body: '' });
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    await reviewsAPI.delete(reviewId);
    fetchReviews();
  };

  const handleHelpful = async (reviewId) => {
    await reviewsAPI.markHelpful(reviewId);
    fetchReviews();
  };

  return (
    <section className="review-section">
      <div className="review-header">
        <h2>Player Reviews ({reviews.length})</h2>
        {user && !showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            ✍️ Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Your Review</h3>
          {error && <p className="form-error">{error}</p>}
          <div className="form-group">
            <label>Rating</label>
            <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Summarise your review"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              placeholder="Share your thoughts..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="form-input"
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="loading-text">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="empty-text">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-top">
                <div>
                  <div className="star-rating">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={s <= review.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <h4>{review.title}</h4>
                </div>
                <div className="review-meta">
                  <span className="reviewer-name">{review.user?.name}</span>
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p>{review.body}</p>
              <div className="review-actions">
                <button className="helpful-btn" onClick={() => handleHelpful(review._id)}>
                  👍 Helpful ({review.helpful})
                </button>
                {user && (user._id === review.user?._id || user.role === 'admin') && (
                  <button className="delete-btn" onClick={() => handleDelete(review._id)}>
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
