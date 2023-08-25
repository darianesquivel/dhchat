import React, { useState, ChangeEvent, useEffect, useRef, useCallback } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Box, Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { v4 as uuidv4 } from 'uuid';
import SendIcon from "@mui/icons-material/Send";
import Webcam from "react-webcam";

interface ImageUploaderProps {
  showImageUpload: boolean;
  toggleImageUpload: (newValue: boolean) => void;
  handleSubmit: () => void;
  setNewMessage: (message: any) => void;
  setShowImageUpload: (value: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  handleSubmit,
  setNewMessage,
  setShowImageUpload
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('')
  const [previewView, setPreviewView] = useState(false)

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file)
  };

  const handleCancel = () => {
    setSelectedImage(null)
    setPreviewView(false)
    setNewMessage('')
    setPreviewImage('')
  };

  const handleSubmitImage = () => {
    handleSubmit()
    setPreviewView(false)
    setNewMessage('')
    setShowImageUpload(false)
  }

  useEffect(() => {
    const uploadImage = async () => {
      if (selectedImage) {
        const storage = getStorage();

        const token = uuidv4();
        const fileExtension = selectedImage.name.split('.').pop();
        const fileName = `${token}.${fileExtension}`;

        const storageRef = ref(storage, `posts/${fileName}`);

        try {
          await uploadBytes(storageRef, selectedImage);
          setPreviewView(true)
          setSelectedImage(null);

          const uploadedImageUrl = await getDownloadURL(storageRef);
          setPreviewImage(uploadedImageUrl)
          setNewMessage(uploadedImageUrl)

        } catch (error) {
          console.error(error)
        }
      }
    }
    uploadImage()
    // eslint-disable-next-line
  }, [selectedImage])


  const webcamRef = useRef<Webcam | null>(null);
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setNewMessage(imageSrc)
        setPreviewImage(imageSrc)
        setPreviewView(true)
      }
    }
  }, [webcamRef, setNewMessage])

  return (
    <Box
      sx={{
        backgroundColor: '#A8CF45',
        boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        minWidth: 400,
        minHeight: 400,
      }}
    >
      {
        !previewView ?
          <Box
            sx={{
              minHeight: 400,
              display: 'grid',
              gap: 1,
              gridTemplateRows: '1fr 80%',
              alignItems: 'center',
              justifyItems: "center"
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Tooltip title="Supports images in JPEG, PNG, WEBP, GIF, AVIF and TIFF formats." placement="top">
                <InfoIcon sx={{ color: 'white' }} />
              </Tooltip>
              <input type="file" onChange={handleImageChange} accept="image/*" />
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={350}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button size='small' variant='outlined' color='success' sx={{ borderRadius: 8 }} onClick={capture}>Capture photo</Button>
                <Button size='small' variant='contained' color='error' sx={{ borderRadius: 8 }} onClick={() => setShowImageUpload(false)}>Cancel</Button>
              </Box>

            </Box>


          </Box>
          :
          null
      }
      {
        previewView && (
          <Box
            sx={{
              minHeight: 400,
              display: 'grid',
              gap: 3,
              gridTemplateRows: '1fr 20%',
              alignItems: 'center',
              justifyItems: "center",
            }}
          >
            <img src={previewImage} alt="" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button sx={{ borderRadius: 10 }} color='error' variant='outlined' onClick={handleCancel}>Cancel</Button>
              <Button
                sx={{ borderRadius: 10 }}
                variant="contained"
                color="success"
                style={{ width: "10%" }}
                onClick={handleSubmitImage}
                startIcon={<SendIcon style={{ marginLeft: "10px" }} />}
                size="small"
              >
              </Button>
            </Box>

          </Box>

        )
      }
    </Box >
  );
};

export default ImageUploader;
