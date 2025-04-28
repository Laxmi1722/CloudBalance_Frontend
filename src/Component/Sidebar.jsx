
import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ExploreIcon from '@mui/icons-material/Explore';
import CloudIcon from '@mui/icons-material/Cloud';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);


  const sidebarItems = {
    ADMIN: [
      { name: 'User Management', path: '/home/user-management' ,icon:<PeopleIcon/>},
      { name: 'Cost Explorer', path: '/home/cost-explorer' ,icon:<ExploreIcon/>},
      { name: 'AWS Services', path: '/home/aws-services',icon:<CloudIcon/> },
      { name: 'Account Onboarding', path: '/home/onboarding',icon:<AccountCircleIcon/> },
    ],
    READ_ONLY: [
      { name: 'User Management', path: '/home/user-management',icon:<PeopleIcon/> },
      { name: 'Cost Explorer', path: '/home/cost-explorer',icon:<ExploreIcon/> },
      { name: 'AWS Services', path: '/home/aws-services',icon:<CloudIcon/>  },
     
    ],
    USER: [
      { name: 'Cost Explorer', path: '/home/cost-explorer',icon:<PeopleIcon/> },
      { name: 'AWS Services', path: '/home/aws-services' ,icon:<ExploreIcon/> },
    ],
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E0E0E0',
        // position:"fixed",
       
      
        padding: 2,
      }}
    >
      <List>
        {(sidebarItems[role] || []).map((item, index) => (
          <ListItem
            
            key={index}
            
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#F1F9FF',
              },
              marginTop: index !== 0 ? 1 : 0,
            }}
           
          >
                {item.icon && <ListItemIcon sx={{ color: '#007BFF' }}>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
