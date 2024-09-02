import Navbar from "../components/Navbar";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Create.css";
import { categories } from "../components/categories";

function Create() {
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
            setImageUploaded(true);
        }
    };

    const handleNextPage = () => {
        navigate('/page-two', { state: { category, title, image } });
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div>
            <Navbar onSearchTerm={() => {}}/>
            <div className="main-container">
                <div className="left-container">
                    <div className="navigation-buttons">
                        <button className="active-button" >Step 1</button>
                        <button className="step-two-button" onClick={() => handleNavigation('/page-two')}>Step 2</button>
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
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
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
                                onChange={handleImageChange}
                            />
                            
                        </div>
                        <button className="lo-submit" onClick={handleNextPage}>Next</button>
                    </div>
                </div>
                <div className="right-container">
                    <h2>Preview</h2>
                    <p><strong>Category:</strong> {category}</p>
                    <p><strong>Title:</strong> {title}</p>
                    {!imageUploaded && (
                        <p><strong>Image:</strong></p>
                    )}
                    {image && (
                        <div>
                            <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Create;
