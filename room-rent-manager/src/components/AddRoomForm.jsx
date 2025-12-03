import React, { useState } from 'react';

const AddRoomForm = ({ onAddRoom }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('Standard');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !price) return;

        setIsSubmitting(true);

        setTimeout(() => {
            onAddRoom({
                name,
                type,
                price: parseFloat(price),
                imageFile: image
            });

            setName('');
            setType('Standard');
            setPrice('');
            setImage(null);
            setIsSubmitting(false);
        }, 300);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="input-group">
                    <label>Property Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ocean View Suite"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="input-group">
                    <label>Property Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    >
                        <option value="Standard">Standard Room</option>
                        <option value="Deluxe">Deluxe Room</option>
                        <option value="Suite">Luxury Suite</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Price per Night ($)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="input-group">
                    <label>Property Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        disabled={isSubmitting}
                        style={{ padding: '0.5rem' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                    {isSubmitting ? 'Adding Property...' : 'Add Property'}
                </button>
            </div>
        </form>
    );
};

export default AddRoomForm;
