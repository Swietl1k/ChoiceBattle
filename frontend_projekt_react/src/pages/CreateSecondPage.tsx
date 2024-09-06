import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import "./CreateSecondPage.css";
import { ImCross } from "react-icons/im";

function CreateSecondPage() {
    const location = useLocation(); 
    const { category, rankingTitle, rankingImage } = location.state; 



    const [itemTitle, setItemTitle] = useState('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [items, setItems] = useState<{ itemTitle: string, itemImage: File | null }[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    useEffect(() => {
        console.log('Modal Open:', isModalOpen, 'Modal Image:', modalImage);
    }, [isModalOpen, modalImage]);

    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setItemImage(file);
            setImageUploaded(true);
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    const handleImageRemove = () => {
        setItemImage(null);
        setImageUploaded(false);
    };

    const handleAddItem = () => {
        if (itemTitle && itemImage) {
            setItems([...items, { itemTitle, itemImage }]);
            setItemTitle('');
            setItemImage(null);
            setImageUploaded(false);
        } else {
            alert('Please fill in the title and upload an image before adding.');
        }
    };

    const handleImageClick = (itemImage: File) => {
        const objectURL = URL.createObjectURL(itemImage);
        console.log('Generated Object URL:', objectURL);
        setModalImage(objectURL);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleFinish = async () => {
        if (items.length < 2) {
            alert("You need to add at least 2 items before submitting.");
            return;
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                alert("User is not authenticated");
                return;
            }

            let rankingImageBase64 = rankingImage;
            if (rankingImage instanceof File) {
                const reader = new FileReader();
                rankingImageBase64 = await new Promise<string | null>((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = () => reject(null);
                    reader.readAsDataURL(rankingImage);
                });
            }

    
            const itemsData = {
                category,  
                rankingTitle, 
                rankingImage: rankingImageBase64,  
                items: items.map(item => ({
                    title: item.itemTitle,
                    image: item.itemImage ? URL.createObjectURL(item.itemImage) : null
                }))
            };

            const response = await axios.post('http://localhost:5000/api/submit-items', itemsData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('Items successfully submitted');

                sessionStorage.removeItem('savedCategory');
                sessionStorage.removeItem('savedTitle');
                sessionStorage.removeItem('savedImage');

                navigate('/');
            } else {
                alert('Failed to submit items');
            }
        } catch (error) {
            console.error("Error submitting items:", error);
            alert('There was an error submitting your items');
        }
    };

    return (
        <div>
            <Navbar onSearchTerm={() => { }} />
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
                                value={itemTitle}
                                onChange={(e) => setItemTitle(e.target.value)}
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
                                <img src={URL.createObjectURL(itemImage!)} alt="Preview" className="image-preview-second" />
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
                    <h2>Items List:</h2>
                    <div className="items-container">
                        {items.map((item, index) => (
                            <div key={index} className="item-title-image-remove">
                                <img
                                    src={URL.createObjectURL(item.itemImage!)}
                                    alt="Item Preview"
                                    className="item-image"
                                    onClick={() => handleImageClick(item.itemImage!)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <p className="item-title"><strong>{item.itemTitle}</strong></p>
                                <button
                                    className="item-remove"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <ImCross className="cross-icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <span className="close">&times;</span>
                    <img className="modal-content" src={modalImage!} alt="Full size" />
                </div>
            )}
        </div>
    );
}

export default CreateSecondPage;
