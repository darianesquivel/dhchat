import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Switch } from '@mui/material';

export default function CustomSelected({ setLenguage, setTranslateMe }: any) {
  const [value, setValue] = useState("en");
  const [showTranslateMe, setShowTranslateMe] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    const selectedLanguage = event.target.value;
    setLenguage(selectedLanguage);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTranslateMe(event.target.checked);
    setTranslateMe(event.target.checked)
  };

  return (
    <Box>
      <FormControl sx={{ m: 0, maxWidth: 150, alignItems: "center", }}>
        <FormHelperText>Translate me</FormHelperText>
        <Switch size="small" checked={showTranslateMe} onChange={handleSwitchChange} />
      </FormControl>
      <FormControl sx={{ m: 0, maxWidth: 150, fontSize: 10, marginRight: 1 }}>
        <FormHelperText>Translate to</FormHelperText>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Translate to" }}
          size="small"
          sx={{ fontSize: 12, maxHeight: 24, backgroundColor: "white" }}
        >
          <MenuItem value={"ar"} sx={{ fontSize: 12 }}>Arab</MenuItem>
          <MenuItem value={"zh"} sx={{ fontSize: 12 }}>Chinese</MenuItem>
          <MenuItem value={"de"} sx={{ fontSize: 12 }}>Deutsch</MenuItem>
          <MenuItem value={"en"} sx={{ fontSize: 12 }}>English</MenuItem>
          <MenuItem value={"fr"} sx={{ fontSize: 12 }}>French</MenuItem>
          <MenuItem value={"hi"} sx={{ fontSize: 12 }}>Hindi</MenuItem>
          <MenuItem value={"it"} sx={{ fontSize: 12 }}>Italian</MenuItem>
          <MenuItem value={"ja"} sx={{ fontSize: 12 }}>Japanese</MenuItem>
          <MenuItem value={"pl"} sx={{ fontSize: 12 }}>Polish</MenuItem>
          <MenuItem value={"pt"} sx={{ fontSize: 12 }}>Portuguese</MenuItem>
          <MenuItem value={"ru"} sx={{ fontSize: 12 }}>Russian</MenuItem>
          <MenuItem value={"es"} sx={{ fontSize: 12 }}>Spanish</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
