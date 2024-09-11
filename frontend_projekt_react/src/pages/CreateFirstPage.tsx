import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateFirstPage.css";
import { categories } from "../components/categories";
import { imageStorage } from "../components/configFirebase";
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";

function Create() {

    const [category, setCategory] = useState('');
    const [rankingTitle, setrankingTitle] = useState('');
    const [rankingImage, setrankingImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const [description, setDescription] = useState('');
    const [firebaseImageURL, setFirebaseImageURL] = useState<string | null>(null);
    const [firebaseImageRef, setFirebaseImageRef] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setrankingImage(file);
            uploadImageToFirebase(file);
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    const uploadImageToFirebase = (file: File) => {
        const imageListRef = ref(imageStorage, 'main_image/');

        listAll(imageListRef).then((response) => {
            if (response.items.length >= 1) {
                alert("You can only upload one image.");
            } else {
                // Jeśli nie ma żadnych zdjęć, pozwól na upload nowego zdjęcia
                const imageRef = ref(imageStorage, `main_image/${file.name + '_' + Date.now()}`);
                uploadBytes(imageRef, file).then(() => {
                    //alert("Image uploaded to firebase");
                    getDownloadURL(imageRef).then((url) => {
                        setFirebaseImageURL(url);  
                        setFirebaseImageRef(imageRef.fullPath);
                        setImageUploaded(true);

                        
                        localStorage.setItem('firebaseImageURL', url);
                        localStorage.setItem('imageUploaded', 'true');
                        localStorage.setItem('firebaseImageRef', imageRef.fullPath);
                    });
                }).catch((error) => {
                    console.error("Upload failed:", error);
                });
            }
        }).catch((error) => {
            console.error("Failed to check image list:", error);
        });
    };

    const deleteImageFromFirebase = () => {
        if (!firebaseImageRef) return; 
        const fileRef = ref(imageStorage, firebaseImageRef);

        deleteObject(fileRef).then(() => {
            //alert("Image deleted successfully!");
            setFirebaseImageURL(null);  
            setFirebaseImageRef(null);  
            setImageUploaded(false);    

            localStorage.removeItem('firebaseImageURL');
            localStorage.removeItem('imageUploaded');
            localStorage.removeItem('firebaseImageRef');
        }).catch((error) => {
            console.error("Error deleting the file:", error);
        });
    };
    
    useEffect(() => {
        const ImageListRef = ref(imageStorage, 'main_image');
        listAll(ImageListRef).then((response) => {
            if (response.items.length > 0) {
                getDownloadURL(response.items[0]).then((url) => {
                    setFirebaseImageURL(url);
                });
            }
        });
    }, []);


    const validateForm = () => {
        if (!category) {
            alert('Please select a category.');
            return false;
        }
        if (!rankingTitle) {
            alert('Please enter a ranking title.');
            return false;
        }

        if (!description) {
            alert('Please enter a description.');
            return false;
        }

        if (!rankingImage && !firebaseImageURL) {
            alert('Please upload an image.');
            return false;
        }
        return true;
    };

    const handleNextPage = () => {
        if (validateForm()) { 
            localStorage.setItem('category', category);
            localStorage.setItem('rankingTitle', rankingTitle);
            localStorage.setItem('description', description);
            navigate('/create-two');
        }
    };

    const handleImageRemove = () => {
        deleteImageFromFirebase(); 
    };
    
    useEffect(() => {
        const savedCategory = localStorage.getItem('category');
        const savedTitle = localStorage.getItem('rankingTitle');
        const savedDescription = localStorage.getItem('description');
        const savedImageURL = localStorage.getItem('firebaseImageURL');
        const savedImageUploaded = localStorage.getItem('imageUploaded');
        const savedImageRef = localStorage.getItem('firebaseImageRef');

        if (savedCategory) setCategory(savedCategory);
        if (savedTitle) setrankingTitle(savedTitle);
        if (savedDescription) setDescription(savedDescription);
        if (savedImageURL) setFirebaseImageURL(savedImageURL);
        if (savedImageUploaded === 'true') setImageUploaded(true);
        if (savedImageRef) setFirebaseImageRef(savedImageRef);
    }, []);


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
                                value={rankingTitle}
                                onChange={(e) => setrankingTitle(e.target.value)}
                                placeholder="Enter ranking title"
                            />
                        </div>
                        <div className="input">
                            <input
                                type="text"
                                className="text-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter ranking description"
                            />
                        </div>
                        {!imageUploaded && ( // Ukryj przycisk upload gdy obraz został załadowany
                            <div className="input file-input-container">
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
                        )}
                        <button className="lo-submit" onClick={handleNextPage}>Next</button> 
                    </div>
                </div>
                <div className="right-container">
                    <h2>Preview</h2>
                    <p>Category: <strong>{category}</strong></p>
                    <p>Title: <strong>{rankingTitle}</strong></p>
                    <p>Description: <strong>{description}</strong></p>
                    {!imageUploaded && (
                        <p>Image:</p>
                    )}
                    {firebaseImageURL && (
                        <div className="image-and-button">
                            <img src={firebaseImageURL} alt="Uploaded to Firebase" className="image-preview" />
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
