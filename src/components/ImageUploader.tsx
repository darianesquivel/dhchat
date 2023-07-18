import React, { useState, ChangeEvent } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, Button, Chip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  showImageUpload: boolean;
  toggleImageUpload: (newValue: boolean) => void; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  showImageUpload,
  toggleImageUpload
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadInProgress, setIsUploadInProgress] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const handleImageUpload = async (): Promise<void> => {
    if (selectedImage) {
      if (selectedImage.size <= 1 * 1024 * 1024) {
        setIsUploadInProgress(true);
        setSuccessMessage('');
        setUploadError('');

        const storage = getStorage();

        const token = uuidv4();
        const fileExtension = selectedImage.name.split('.').pop();
        const fileName = `${token}.${fileExtension}`;

        const storageRef = ref(storage, `posts/${fileName}`);

        try {
          await uploadBytes(storageRef, selectedImage);
          setSuccessMessage('Image uploaded successfully');
          setIsUploadInProgress(false);
          setSelectedImage(null); 
        } catch (error) {
          setUploadError('Error loading image');
          setIsUploadInProgress(false);
        }
      } else {
        setUploadError('The image size cannot be larger than 1 MB');
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file || null);
    setSuccessMessage('');
    setUploadError('');
  };

  const handleCancel = (): void => {
    setSelectedImage(null);
    setSuccessMessage('');
    setUploadError('');
    toggleImageUpload(false);
  };

  const handleFormClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        padding: '10px',
        backgroundColor: '#A8CF45',
        boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        width: 'auto',
        fontSize: '13px',
      }}
      onClick={handleFormClick}
    >
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {uploadError && (
        <Chip
          color="error"
          size="small"
          label={uploadError}
          sx={{
            width: 'auto',
            fontSize: 12,
            padding: '14px',
            color: 'white',
            marginLeft: "15px"
          }}
        />
      )}
      {!uploadError && !successMessage && (
        <Button
          variant="contained"
          color="success"
          style={{ width: '100px', fontSize: 10, margin: 5, borderRadius: 15, marginLeft: "15px" }}
          onClick={handleImageUpload}
          size="small"
          disabled={isUploadInProgress}
        >
          Upload image
        </Button>
      )}
      {successMessage && (
        <Chip
          color="warning"
          size="small"
          label={successMessage}
          sx={{
            width: 'auto',
            fontSize: 12,
            padding: '14px',
            color: 'white',
            marginLeft: "15px",
            marginRight: "5px",
          }}
        />
      )}
      <Button
        variant="contained"
        color="success"
        style={{ width: '100px', fontSize: 10, margin: 5, borderRadius: 15 }}
        onClick={handleCancel}
        size="small"
      >
        Cancel
      </Button>
    </Box>
  );
};

export default ImageUploader;
