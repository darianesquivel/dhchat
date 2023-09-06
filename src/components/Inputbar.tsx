import { Box, Button, IconButton, Menu, MenuItem, TextField, Tooltip } from '@mui/material'
import SendIcon from "@mui/icons-material/Send";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { makeStyles } from '@mui/styles';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 80% 1fr',
        backgroundColor: "#A8CF45",
        alignContent: 'center'
    },
    iconsAndMore: {
        display: 'flex',
        justifyContent: 'center'
    },
    input: {
    },
    sendAndAudio: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

export default function Inputbar() {
    const classes = useStyles()
    const [message, setMessage] = useState('')
    const [openMore, setOpenMore] = useState<null | HTMLElement>(null); // Estado menu 'more' del input.


    const handleChange = (event: any) => {
        setMessage(event.target.value)
    }

    const handleSubmitMessage = () => {
        console.log({ message })
    }

    const handleMore = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMore(event.currentTarget); // Abre el menu more, +.
    };

    const handleCloseMore = () => {
        setOpenMore(null); // Cierra el menu 'more'.
    };

    return (
        //     <Box
        //         sx={{
        //             width: "100%",
        //             display: "flex",
        //             gap: 1,
        //             p: 1,
        //             backgroundColor: "#A8CF45",
        //             borderRadius: 2,
        //         }}
        //     >

        //         <Tooltip title="Emojis" placement="top">
        //             <Button
        //                 sx={{ borderRadius: 10 }}
        //                 variant="contained"
        //                 color="success"
        //                 style={{ width: "10px" }}
        //                 // onClick={(event) => toggleShowEmoji(event)}
        //                 startIcon={<EmojiEmotionsIcon style={{ marginLeft: "10px" }} />}
        //                 size="small"
        //             />
        //         </Tooltip>
        //         {/* <Menu
        //   sx={{ display: 'flex' }}
        //   open={false} //arreglar
        //   onClose={() => setShowEmoji(false)}
        // >
        //   <Picker
        //     data={data}
        //     emojiSize={24}
        //     emojiButtonSize={36}
        //     onEmojiSelect={addEmoji}
        //     maxFrequentRows={0}
        //   />
        // </Menu> */}

        //         <Tooltip title="Attach" placement="top">
        //             <Button
        //                 sx={{ borderRadius: 10 }}
        //                 variant="contained"
        //                 color="success"
        //                 style={{ width: "10px" }}
        //                 // onClick={(event) => toggleImageUpload(event)}
        //                 startIcon={<CameraAltIcon style={{ marginLeft: "10px" }} />}
        //                 size="small"
        //             />
        //         </Tooltip>
        //         {/* <Dialog
        //             open={showImageUpload}
        //             onClose={() => setShowImageUpload(false)}
        //         >
        //             <ImageUploader
        //                 showImageUpload={showImageUpload}
        //                 toggleImageUpload={toggleImageUpload as () => void}
        //                 setNewMessage={setNewMessage}
        //                 setShowImageUpload={setShowImageUpload}
        //                 handleSubmit={() => handleSubmit('image')}
        //             />
        //         </Dialog> */}

        //         <TextField
        //             sx={{
        //                 backgroundColor: "white",
        //                 borderRadius: 10,
        //                 width: "90%",
        //                 "& .MuiOutlinedInput-root": {
        //                     borderRadius: 10,
        //                 },
        //             }}
        //             size="small"
        //             minRows={3}
        //             placeholder="Type your message..."
        //         // value={newMessage}
        //         // onChange={(e) => setNewMessage(e.target.value)}
        //         // onKeyDown={handleKeyDown}
        //         />

        //         <Tooltip title="Send" placement="top">
        //             <Button
        //                 sx={{ borderRadius: 10 }}
        //                 variant="contained"
        //                 color="success"
        //                 style={{ width: "10%" }}
        //                 // onClick={() => handleSubmit()}
        //                 startIcon={<SendIcon style={{ marginLeft: "10px" }} />}
        //                 size="small"
        //             >
        //             </Button>
        //         </Tooltip>


        //         <AudioRecorder
        //             // onRecordingComplete={addAudioElement}
        //             // recorderControls={recorderControls}
        //             showVisualizer={true}
        //             downloadFileExtension="webm"
        //         />

        //     </Box>

        <Box className={classes.container}>
            <Box className={classes.iconsAndMore}>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <IconButton onClick={handleMore}>
                    <AddIcon />
                </IconButton>
                <Menu
                    id="menu-more"
                    anchorEl={openMore}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(openMore)}
                    onClose={handleCloseMore}
                >
                    <MenuItem onClick={handleCloseMore}>Camara</MenuItem>
                    <MenuItem onClick={handleCloseMore}>Send photo</MenuItem>
                </Menu>
            </Box>
            <TextField size='small' className={classes.input} onChange={handleChange} />
            <Box className={classes.sendAndAudio}>
                {message.length ?
                    <IconButton onClick={handleSubmitMessage}>
                        <SendIcon />
                    </IconButton> :
                    <IconButton>
                        <MicIcon />
                    </IconButton>
                }
            </Box>
        </Box>
    )
}
