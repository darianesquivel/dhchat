import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';


// const ImageUploader: React.FC = () => {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

//   const handleImageUpload = (): void => {
//     if (selectedImage) {
//       const storageRef = firebase.storage().ref();
//       const imageRef = storageRef.child(selectedImage.name);

//       // Sube la imagen al almacenamiento de Firebase
//       imageRef.put(selectedImage)
//         .then(() => {
//           console.log('Imagen cargada exitosamente');
//           // Aquí puedes realizar acciones adicionales después de la carga exitosa
//         })
//         .catch((error: firebase.FirebaseError) => {
//           console.error('Error al cargar la imagen:', error);
//           // Aquí puedes manejar errores o mostrar mensajes al usuario
//         });
//     }
//   };

//   const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
//     const file = event.target.files && event.target.files[0];
//     setSelectedImage(file || null);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageChange} />
//       <button onClick={handleImageUpload}>Subir imagen</button>
//     </div>
//   );
// };

// export default ImageUploader;