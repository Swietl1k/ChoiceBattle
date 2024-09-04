import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateFirstPage.css";
import { categories } from "../components/categories";

function Create() {
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
            setImageUploaded(true);
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    const handleNextPage = () => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result as string;
                navigate('/create-two', { state: { category, title, image: base64Image } });
            };
            reader.readAsDataURL(image);
        } else {
            navigate('/create-two', { state: { category, title, image: null } });
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        setImageUploaded(false);
        localStorage.removeItem('savedImage');
    };
    
    useEffect(() => {
        const savedCategory = localStorage.getItem('savedCategory');
        const savedTitle = localStorage.getItem('savedTitle');
        const savedImage = localStorage.getItem('savedImage');

        if (savedCategory) {
            setCategory(savedCategory);
        }
        if (savedTitle) {
            setTitle(savedTitle);
        }
        if (savedImage) {
            fetch(savedImage) 
              .then(res => res.blob()) 
              .then(blob => {
                  const file = new File([blob], 'savedImage', { type: 'image/jpeg' });
                  setImage(file);
                  setImageUploaded(true);
              });
        }
    }, []);

    // Zapisz dane do localStorage przy każdej zmianie
    useEffect(() => {
        localStorage.setItem('savedCategory', category);
    }, [category]);

    useEffect(() => {
        localStorage.setItem('savedTitle', title);
    }, [title]);

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                localStorage.setItem('savedImage', reader.result as string); // Zapisz obraz w base64
            };
            reader.readAsDataURL(image); // Konwertuj obraz na base64
        }
    }, [image]);

    return (
        <div>
            <Navbar onSearchTerm={() => {}}/>
            <div className="main-container">
                <div className="left-container">
                    <div className="navigation-buttons">
                        <button className="active-button" >Step 1</button>
                        <button className="step-two-button" onClick={handleNextPage}>Step 2</button>
                    </div>
                    <div className="lo-header">
                        <div className="text">Create Ranking - Step 1</div>
                        <div className="underline"></div>
                    </div>
                    <div className="lo-inputs">
                        <div className="input">
                            <select
                                className="select-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select a category</option>
                                {categories
                                .filter(cat=>cat !="All")
                                .map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input">
                            <input
                                type="text"
                                className="text-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter ranking title"
                            />
                        </div>
                        <div className={`input file-input-container ${imageUploaded ? 'image-uploaded' : ''}`}>
                            <label htmlFor="file-upload" className="file-upload-label">
                                Click to upload image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                className="file-input"
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                            />
                            
                        </div>
                        <button className="lo-submit" onClick={handleNextPage}>Next</button>
                    </div>
                </div>
                <div className="right-container">
                    <h2>Preview</h2>
                    <p>Category: <strong>{category}</strong></p>
                    <p>Title: <strong>{title}</strong></p>
                    {!imageUploaded && (
                        <p>Image:</p>
                    )}
                    {image && (
                        <div className="image-and-button">
                            <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                            <button className="remove-button" onClick={handleImageRemove}>
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Create;
