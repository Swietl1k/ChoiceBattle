import Navbar from "../components/Navbar";
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import "./CreateSecondPage.css";

function CreateSecondPage() {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [items, setItems] = useState<{ title: string, image: File | null }[]>([]);
    
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


    const handleImageRemove = () => {
        setImage(null);
        setImageUploaded(false);
    };

    const handleAddItem = () => {
        if (title && image) {
            setItems([...items, { title, image }]);
            setTitle('');
            setImage(null);
            setImageUploaded(false);
        } else {
            alert('Please fill in the title and upload an image before adding.');
        }
    };

   

    const handleFinish = () => {
        // Handle the finish action, e.g., save data or navigate to another page
        alert('Finished adding items');
    };

    return (
        <div>
            <Navbar onSearchTerm={() => {}}/>
            <div className="main-container-second">
                <div className="left-container-second">
                    <div className="navigation-buttons-second">
                        <button className="step-one-button-second" onClick={() => navigate('/create-one')}>Step 1</button>
                        <button className="active-button-second">Step 2</button>
                    </div>
                    <div className="lo-header-second">
                        <div className="text-second">Create Ranking - Step 2</div>
                        <div className="underline-second"></div>
                    </div>
                    <div className="lo-inputs-second">
                        <div className="input-second">
                            <input
                                type="text"
                                className="text-input-second"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter item title"
                            />
                        </div>
                        {!imageUploaded ? (
                        <div className={`input file-input-container-second`}>
                            <label htmlFor="file-upload-second" className="file-upload-label-second">
                                Click to upload image
                            </label>
                            <input
                                id="file-upload-second"
                                type="file"
                                className="file-input-second"
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                            />
                        </div>
                        ) : (
                        
                        <div className="image-and-button-second">
                            <img src={URL.createObjectURL(image!)} alt="Preview" className="image-preview-second" />
                            <button className="remove-button-second" onClick={handleImageRemove}>
                                Remove Image
                            </button>
                        </div>
                    )}
                        <div className="submit-buttons">
                            <button className="submit-add-button" onClick={handleAddItem}>Add</button>
                            <button className="submit-finish-button" onClick={handleFinish}>Finish</button>
                        </div>
                    </div>
                </div>
                <div className="right-container-second">
                    <h2>Preview</h2>
                    <div className="items-container-second">
                        {items.map((item, index) => (
                            <div key={index} className="item-preview-second">
                                <img 
                                src={URL.createObjectURL(item.image!)} 
                                alt="Item Preview" 
                                className="image-preview-second" 
                            />
                                <p className="item-title-second"><strong>{item.title}</strong></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateSecondPage;
