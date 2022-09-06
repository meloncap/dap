import { AiOutlineBank, AiOutlineProject } from "react-icons/ai"; 
import { BiCustomize } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { GiBurn } from "react-icons/gi";
import { BsDroplet, BsBank } from "react-icons/bs"
import { RiAncientPavilionLine } from "react-icons/ri"
import { MdOutlineLocalGroceryStore } from "react-icons/md"
import { CgCommunity } from "react-icons/cg"
import { FaBlog } from "react-icons/fa"

const sidebarNav = [
    {
        link: '/',
        section: 'dashboard',
        icon: <BiCustomize />,
        text: 'Dashboard'
    },
    {
        link: '/treasury',
        section: 'treasury',
        icon: <IoDiamondOutline />,
        text: 'Treasury Balance'
    },
    {
        link: '/buyback',
        section: 'buyback',
        icon: <GiBurn />,
        text: 'BuyBack & Burn'
    },
    {
        link: '/airdrops',
        section: 'airdrops',
        icon: <BsDroplet />,
        text: 'Giveaway & Airdrops'
    },
    {
        link: ['/stake', '/lock', '/node'],
        subTab: true,
        icon: <BsBank />,
        text: 'Staking',
        subTextList: ['Stake', 'Lock', 'Node']
    },
    {
        link: '/bonding',
        section: 'bonding',
        icon: <AiOutlineBank />,
        text: 'Bonding'
    },
    {
        link: ['/mint', '/manage', '/borrow', '/stakeNFT'],
        subTab: true,
        icon: <RiAncientPavilionLine />,
        text: 'CheemsX NFT',
        subTextList: ['Mint', 'Manage', 'Redeeem', 'Stake NFT']
    },
    {
        link: '/market',
        section: 'market',
        icon: <MdOutlineLocalGroceryStore />,
        text: 'NFT Market'
    },
    {
        link: '/involve',
        section: 'involve',
        icon: <CgCommunity />,
        text: 'Community Involve'
    },
    {
        link: '/incubation',
        section: 'incubation',
        icon: <AiOutlineProject />,
        text: 'Project Incubation'
    },
    {
        link: '/update',
        section: 'update',
        icon: <FaBlog />,
        text: 'News, Update & Blogs'
    },
]

export default sidebarNav