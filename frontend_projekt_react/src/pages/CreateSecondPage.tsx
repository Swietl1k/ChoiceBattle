import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from "axios";
import "./CreateSecondPage.css";
import { ImCross } from "react-icons/im";

function CreateSecondPage() {


    const [itemTitle, setItemTitle] = useState('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [items, setItems] = useState<{ itemTitle: string, itemImage: File | null }[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const navigate = useNavigate();

    // Ustawienie liczby elementów w localStorage
    useEffect(() => {
        localStorage.setItem('itemCount', items.length.toString());
    }, [items]);

    // Funkcja do obsługi zmiany obrazu
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setItemImage(file);
            setImageUploaded(true);
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    // Funkcja do usuwania obrazu
    const handleImageRemove = () => {
        setItemImage(null);
        setImageUploaded(false);
    };

    // Funkcja do dodawania elementu do listy
    const handleAddItem = () => {
        if (items.length >= 32) {
            alert('You cannot add more than 32 items.');
            return;
        }

        if (itemTitle && itemImage) {
            setItems([...items, { itemTitle, itemImage }]);
            setItemTitle('');
            setItemImage(null);
            setImageUploaded(false);
        } else {
            alert('Please fill in the title and upload an image before adding.');
        }
    };

    // Funkcja do obsługi kliknięcia na obraz (otwieranie modala)
    const handleImageClick = (itemImage: File | null) => {
        if (itemImage) {
            const objectURL = URL.createObjectURL(itemImage);  // Tylko jeśli itemImage nie jest null
            setModalImage(objectURL);
            setIsModalOpen(true);
        }
    };

    // Funkcja do zamykania modala
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    // Funkcja do usuwania elementu z listy
    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    // Funkcja do konwersji pliku na base64
    const convertToBase64 = (file: File): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(null);
            reader.readAsDataURL(file);
        });
    };

    // Funkcja do zakończenia tworzenia rankingu
    const handleFinish = async () => {
        if (![0,1,8, 16, 32].includes(items.length)) {
            alert("You must add exactly 8, 16, or 32 items.");
            return;
        }

        try {
            const token = localStorage.getItem('id_token') 
            
            if (!token) {
                alert("User is not authenticated");
                return;
            } 

            // Konwersja obrazów elementów na base64
            const choices_data = await Promise.all(
                items.map(async item => {
                    const imageBase64 = item.itemImage
                        ? await convertToBase64(item.itemImage)
                        : null;

                    return {
                        title: item.itemTitle,
                        image_url: imageBase64,
                        pick_count: 0,
                        win_count: 0
                    };
                })
            );

            const requestBody = {
                title: localStorage.getItem('rankingTitle'),
                category: localStorage.getItem('category'),
                description: localStorage.getItem('description'),
                main_image_url: localStorage.getItem('savedImage'),
                choices_data: choices_data
            };

            const response = await axios.post('http://127.0.0.1:8000/strona/create/', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert(response.data.message);
                navigate('/');

                localStorage.removeItem('category');
                localStorage.removeItem('rankingTitle');
                localStorage.removeItem('description');
                localStorage.removeItem('savedImage');
                localStorage.removeItem('itemCount');

            } else {
                alert(response.data.message);
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
                        {!imageUploaded && (
                            <div className="input file-input-container-second">
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
                        )}
                        {imageUploaded && itemImage && (
                            <div className="image-and-button-second">
                                <img src={URL.createObjectURL(itemImage)} alt="Preview" className="image-preview-second" />
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
                                {item.itemImage && (
                                    <img
                                        src={URL.createObjectURL(item.itemImage)}
                                        alt="Item Preview"
                                        className="item-image"
                                        onClick={() => handleImageClick(item.itemImage)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
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
