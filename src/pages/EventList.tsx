import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export const EventList = () => {
  return (
    <List component="nav">
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="kakakakakku" src="https://pbs.twimg.com/profile_images/604918632460656640/FdOmiWZW_200x200.png" />
        </ListItemAvatar>
        <ListItemText primary="List 9 - @kakakakakku" secondary="https://kakakakakku.hatenablog.com/" />
      </ListItem>
    </List>
  );
};
