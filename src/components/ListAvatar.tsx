import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import { Switch } from '@mui/material';

export default function ListAvatar({users, onAddParticipants, currentUser}:any) {
  const [checked, setChecked] = useState<string[]>([currentUser]);
  const [openGroup, setOpenGroup] = useState(false)

  const handleToggle = (value: any) => () => {
    const isChecked = checked.includes(value);
    let newChecked: any[] = [];
  
    if (isChecked) {
      newChecked = checked.filter((item) => item !== value);
    } else {
      newChecked = [...checked, value];
    }
  
    setChecked(newChecked);
    onAddParticipants(newChecked);
    
  };

  const handleOpenGroup = () => {
      setOpenGroup(!openGroup)
      setChecked(!openGroup ? ['open-group'] : [currentUser])
      onAddParticipants(!openGroup ? ['open-group'] : [currentUser]);
  }

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItemText id="open-group" primary="Open Group" />
        <Switch
          edge="end"
          onChange={handleOpenGroup}
          checked={openGroup}
        />
      {!openGroup && users?.map((user:any) => {
        const labelId = `checkbox-list-secondary-label-${user.id}`;
        return (
        
        <ListItem
            key={user.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(user.email)}
                checked={checked.includes(user.email) ? true : false}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={user.avatar}
                  src={user.avatar}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={user.displayName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}