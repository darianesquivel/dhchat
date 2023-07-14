import React, { useState, ChangeEvent } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, Button } from '@mui/material';

interface ImageUploaderProps {
  showImageUpload: boolean;
  toggleImageUpload: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  showImageUpload,
  toggleImageUpload
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = async (): Promise<void> => {
    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(storage, selectedImage.name);

      try {
        await uploadBytes(storageRef, selectedImage);
        console.log('Imagen cargada exitosamente');
        // Aquí puedes realizar acciones adicionales después de la carga exitosa
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
        // Aquí puedes manejar errores o mostrar mensajes al usuario
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file || null);
  };

  return (
    <Box sx={{ borderRadius: 2, padding: "10px", backgroundColor: "#A8CF45", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.15)" }}>
      <input type="file" onChange={handleImageChange} accept="image/*"  />
      {/* <button onClick={handleImageUpload}>Subir imagen</button> 
      <button onClick={toggleImageUpload}>Cancelar</button> */}
      <Button
        //sx={{ borderRadius: 3 }}
        variant="contained"
        color="success"
        style={{ width: "100px", fontSize: 10, margin: 5, borderRadius: 15}}
        onClick={handleImageUpload}
        size="small"
      >
        Upload image
      </Button>
      <Button
        //sx={{ borderRadius: 3 }}
        variant="contained"
        color="success"
        style={{ width: "100px", fontSize: 10, margin: 5, borderRadius: 15}}
        onClick={toggleImageUpload}
        size="small"
      >
        Cancel
      </Button>
    </Box>
  );
};

export default ImageUploader;
