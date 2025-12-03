const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const uploadRoomImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
