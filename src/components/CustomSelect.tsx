import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/joy";

export default function CustomSelected({ setLenguage }: any) {
  const [value, setValue] = React.useState("en");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    const selectedLanguage = event.target.value;
    setLenguage(selectedLanguage);
  };

  return (
    <Box>
      <FormControl sx={{ m: 1, maxWidth: 100 }}>
        <FormHelperText>Translate to</FormHelperText>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Translate to" }}
          size="small"
        >
          <MenuItem value={"de"}>de</MenuItem>
          <MenuItem value={"en"}>en</MenuItem>
          <MenuItem value={"es"}>es</MenuItem>
          <MenuItem value={"fr"}>fr</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
