import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import { Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { Fragment, useCallback } from 'react';
import { BsFacebook, BsFillInfoCircleFill } from 'react-icons/bs';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';


type MenuAction = {
    text: string
    icon: React.ReactNode,
    action?: (props: { navigate: NavigateFunction }) => void
    href?: string
}


const mainListItems: MenuAction[] = [
    { text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
    { text: 'Balances', icon: <AnalyticsRoundedIcon />, href: '/balances' },
    { text: 'Transactions', icon: <PeopleRoundedIcon />, href: '/transactions' },
];

const secondaryListItems: MenuAction[] = [
    {
        text: 'App Store', icon: <BsFillInfoCircleFill size={24} />,
        href: 'https://play.google.com/store/apps/details?id=com.colaorange.dailymoneyone'
    },
    {
        text: 'Facebook Page', icon: <BsFacebook size={24} />,
        href: 'https://www.facebook.com/colaorange.daily.money/'
    },

];

const httpRegex = /^(http:\/\/|https:\/\/)/i;

export default function MenuContent() {
    const location = useLocation();
    const navigate = useNavigate()

    const buildMenuItems = useCallback((items: MenuAction[]) => {
        return items.map((item, idx) => {

            const { action, href } = item

            const li = (<ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton selected={location.pathname === href}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>)

            if (href) {
                if (httpRegex.test(href)) {
                    return <a key={idx} href={href} target='_blank'>{li}</a>
                } else {
                    return <Link key={idx} to={href}>{li}</Link>
                }
            } else if (action) {
                <Box key={idx}
                    onClick={() => {
                        action({ navigate })
                    }}
                >{li}</Box>
            }

            return <Fragment key={idx}>
               {li} 
            </Fragment>
        })
    },[location.pathname, navigate])


    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {buildMenuItems(mainListItems)}
            </List>

            <List dense>
                {buildMenuItems(secondaryListItems)}
            </List>
        </Stack>
    );
}