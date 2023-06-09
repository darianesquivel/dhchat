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
        <Switch size="medium" checked={showTranslateMe} onChange={handleSwitchChange} />
      </FormControl>
      <FormControl sx={{ m: 0, maxWidth: 150 }}>
        <FormHelperText>Translate to</FormHelperText>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Translate to" }}
          size="small"
        >
          <MenuItem value={"ar"}>Arab</MenuItem>
          <MenuItem value={"zh"}>Chinese</MenuItem>
          <MenuItem value={"de"}>Deutsch</MenuItem>
          <MenuItem value={"en"}>English</MenuItem>
          <MenuItem value={"fr"}>French</MenuItem>
          <MenuItem value={"hi"}>Hindi</MenuItem>
          <MenuItem value={"it"}>Italian</MenuItem>
          <MenuItem value={"ja"}>Japanese</MenuItem>
          <MenuItem value={"pl"}>Polish</MenuItem>
          <MenuItem value={"pt"}>Portuguese</MenuItem>
          <MenuItem value={"ru"}>Russian</MenuItem>
          <MenuItem value={"es"}>Spanish</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
