import Navbar from "../components/Navbar";
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from "axios";
import "./CreateSecondPage.css";
import { ImCross } from "react-icons/im";

function CreateSecondPage() {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [items, setItems] = useState<{ title: string, image: File | null }[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [modalImage, setModalImage] = useState<string | null>(null); 
    
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

    const handleImageClick = (image: File) => {
        // Otwórz modal i ustaw obraz w oryginalnym rozmiarze
        setModalImage(URL.createObjectURL(image));
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
            // Pobierz token z localStorage lub sessionStorage
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
            if (!token) {
                alert("User is not authenticated");
                return;
            }
    
            // Konwertuj przedmioty na format JSON
            const itemsData = {
                items: items.map(item => ({
                    title: item.title,
                    image: item.image ? URL.createObjectURL(item.image) : null 
                }))
            };
    
            // Wykonaj żądanie POST z tokenem w nagłówkach
            const response = await axios.post('http://localhost:5000/api/submit-items', itemsData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Token JWT
                },
            });
    
            if (response.data.success) {
                alert('Items successfully submitted');
                // Możesz wykonać nawigację lub wyczyścić dane po przesłaniu
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
                    <h2>Items List:</h2>
                    <div className="items-container">
                        {items.map((item, index) => (
                            <div key={index} className="item-title-image-remove">
                                <img 
                                src={URL.createObjectURL(item.image!)} 
                                alt="Item Preview" 
                                className="item-image"
                                onClick={() => handleImageClick(item.image!)}
                                style={{ cursor: 'pointer' }} 
                            />
                                <p className="item-title"><strong>{item.title}</strong></p>
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
