import { useI18nLabel } from '@/contexts/useI18n';
import { Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { Fragment, useCallback } from 'react';
import { FaBalanceScale, FaHome, FaSearch, FaChartLine, FaReceipt } from 'react-icons/fa';
import { FaFacebook, FaGooglePlay } from 'react-icons/fa6';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

const iconSize = 28

type MenuAction = {
    text: string
    icon: React.ReactNode,
    action?: (props: { navigate: NavigateFunction }) => void
    href?: string
}


const mainListItems: MenuAction[] = [
    { text: 'desktop.home', icon: <FaHome size={iconSize} />, href: '/' },
    { text: 'desktop.balanceSheets', icon: <FaBalanceScale size={iconSize} />, href: '/balance-sheets' },
    { text: 'desktop.trendCharts', icon: <FaChartLine size={iconSize} />, href: '/trend-charts' },
    { text: 'desktop.transactions', icon: <FaReceipt size={iconSize} />, href: '/transactions' },
    { text: 'desktop.searchTransactions', icon: <FaSearch size={iconSize} />, href: '/search-transactions' },
];

const secondaryListItems: MenuAction[] = [
    {
        text: 'Google Play', icon: <FaGooglePlay size={iconSize} />,
        href: 'https://play.google.com/store/apps/details?id=com.colaorange.dailymoneyone'
    },
    {
        text: 'Facebook', icon: <FaFacebook size={iconSize} />,
        href: 'https://www.facebook.com/colaorange.daily.money/'
    },

];

const httpRegex = /^(http:\/\/|https:\/\/)/i;

export default function MenuContent() {
    const ll = useI18nLabel()
    const location = useLocation();
    const navigate = useNavigate()

    const buildMenuItems = useCallback((items: MenuAction[]) => {
        return items.map((item, idx) => {

            const { action, href } = item

            const li = (<ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton selected={location.pathname === href} sx={{ p: 1 }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={ll(item.text)} />
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
    }, [location.pathname, navigate, ll])


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