import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from "axios";
import "./CreateSecondPage.css";
import { ImCross } from "react-icons/im";
import { ref,listAll, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { imageStorage } from "../components/configFirebase";

function CreateSecondPage() {

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [itemTitle, setItemTitle] = useState('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [firebaseItemImageURL, setFirebaseItemImageURL] = useState<string | null>(null);
    const [firebaseItemImageRef, setFirebaseItemImageRef] = useState<string | null>(null);
    const [items, setItems] = useState<{ itemTitle: string, firebaseItemImageURL: string | null }[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const navigate = useNavigate();

    // Ustawienie liczby elementów w localStorage
    useEffect(() => {
        localStorage.setItem('itemCount', items.length.toString());
    }, [items]);

    const fetchItemsFromFirebase = () => {
        const listRef = ref(imageStorage, 'item_images/');

        listAll(listRef)
            .then((response) => {
                const promises = response.items.map((itemRef) => 
                    getDownloadURL(itemRef).then((url) => {
                        // Tutaj dzielimy nazwę pliku na podstawie "_", aby usunąć losową część
                        const nameWithoutExtension = itemRef.name.split('.')[0];  // Usuwamy rozszerzenie
                        const cleanTitle = nameWithoutExtension.split('_')[1];  // Usuwamy część losową po tytule

                        return {
                            itemTitle: cleanTitle,
                            firebaseItemImageURL: url,
                            firebaseItemImageRef: itemRef.fullPath
                        };
                    })
                );

                Promise.all(promises).then((itemsFromFirebase) => {
                    setItems(itemsFromFirebase); // Dodanie elementów do listy
                });
            })
            .catch((error) => {
                console.error("Error fetching items from Firebase:", error);
            });
    };

    useEffect(() => {
        fetchItemsFromFirebase(); // Pobierz elementy z Firebase przy załadowaniu komponentu
    }, []);


    useEffect(() => {
        const savedImageURL = localStorage.getItem('firebaseItemImageURL');
        const savedImageRef = localStorage.getItem('firebaseItemImageRef');

        if (savedImageURL) {
            setFirebaseItemImageURL(savedImageURL);
            setImageUploaded(true);
        } else {
            setImageUploaded(false); 
        }

        if (savedImageRef) setFirebaseItemImageRef(savedImageRef);
    }, []);

 
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setItemImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Tworzenie podglądu lokalnego
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    // Funkcja do usuwania obrazu
    const handleImageRemove = () => {
        setItemImage(null); 
        setPreviewImage(null);
    };


    const handleAddItem = () => {
        if (items.length >= 32) {
            alert('You cannot add more than 32 items.');
            return;
        }

        if (itemTitle && itemImage) {
            const imageRef = ref(imageStorage, `item_images/${Date.now()}_${itemTitle}.${itemImage.name.split('.').pop()}`);
            uploadBytes(imageRef, itemImage)
                .then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        const newItem = {
                            itemTitle,
                            firebaseItemImageURL: url,
                            firebaseItemImageRef: imageRef.fullPath
                        };
                        setItems([...items, newItem]); // Dodajemy do listy
                        setItemTitle(''); // Reset tytułu
                        setItemImage(null); // Reset obrazu lokalnie
                    });
                })
                .catch((error) => {
                    console.error("Upload failed:", error);
                });
        } else {
            alert('Please fill in the title and upload an image before adding.');
        }
    };

    // Funkcja do obsługi kliknięcia na obraz (otwieranie modala)
    const handleImageClick = (itemImage: string | File | null) => {
        if (itemImage instanceof File) { 
            // Jeśli to lokalny plik, twórz URL
            const objectURL = URL.createObjectURL(itemImage);
            setModalImage(objectURL);
        } else if (typeof itemImage === 'string') {
            // Jeśli to URL (np. z Firebase), użyj go bezpośrednio
            setModalImage(itemImage);
        }
        setIsModalOpen(true);
    };

    // Funkcja do zamykania modala
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    // Funkcja do usuwania elementu z listy
    const handleRemoveItem = (index: number) => {
        const itemToRemove = items[index];

        if (itemToRemove.firebaseItemImageRef) {

            const fileRef = ref(imageStorage, itemToRemove.firebaseItemImageRef);

            deleteObject(fileRef)
                .then(() => {
                    const updatedItems = items.filter((_, i) => i !== index);
                    setItems(updatedItems); // Usuwamy z listy po usunięciu z Firebase
                })
                .catch((error) => {
                    console.error("Error deleting the file:", error);
                });
        }else {
            console.error("No valid firebaseItemImageRef for the item at index", index);
        }
    };

    // Funkcja do zakończenia tworzenia rankingu
    const handleFinish = async () => {
        if (![8, 16, 32].includes(items.length)) {
            alert("You must add exactly 8, 16, or 32 items.");
            return;
        }

        try {
            const token = localStorage.getItem('id_token') 
            
            if (!token) {
                alert("User is not authenticated");
                return;
            } 

            const choices_data = items.map(item => ({
                title: item.itemTitle,
                image_url: item.firebaseItemImageURL,
                pick_count: 0,
                win_count: 0
            }));

            const requestBody = {
                title: localStorage.getItem('rankingTitle'),
                category: localStorage.getItem('category'),
                description: localStorage.getItem('description'),
                main_image_url: localStorage.getItem('firebaseImageURL'),
                choices_data: choices_data
            };

            const response = await axios.post('https://127.0.0.1:8000/strona/create/', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert(response.data.message);

                const mainImageRef = ref(imageStorage, 'main_image/');
                const itemImagesRef = ref(imageStorage, 'item_images/');

                listAll(mainImageRef)
                .then((response) => {
                    const deletePromises = response.items.map((item) => deleteObject(item));
                    return Promise.all(deletePromises);
                })
                .catch((error) => {
                    console.error("Error deleting files from main_image/:", error);
                });

                // Usuwanie plików z folderu item_images/
                listAll(itemImagesRef)
                .then((response) => {
                    const deletePromises = response.items.map((item) => deleteObject(item));
                    return Promise.all(deletePromises);
                })
                .catch((error) => {
                    console.error("Error deleting files from item_images/:", error);
                });


                localStorage.removeItem('category');
                localStorage.removeItem('rankingTitle');
                localStorage.removeItem('description');
                localStorage.removeItem('savedImage');
                localStorage.removeItem('itemCount');
                navigate('/');

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
                        {!itemImage && (
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
                        {itemImage && previewImage && (
                            <div className="image-and-button-second">
                                <img src={previewImage} alt="Preview" className="image-preview-second" />
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
                                {item.firebaseItemImageURL ? (
                                    <img
                                        src={item.firebaseItemImageURL}
                                        alt="Item Preview"
                                        className="item-image"
                                        onClick={() => handleImageClick(item.firebaseItemImageURL)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <p>No image available</p>
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
            {isModalOpen && modalImage && (
                <div className="modal" onClick={closeModal}>
                    <span className="close">&times;</span>
                    <img className="modal-content" src={modalImage!} alt="Full size" />
                </div>
            )}
        </div>
    );
}

export default CreateSecondPage;
