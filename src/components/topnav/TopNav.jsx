import styled from '@emotion/styled'
import { Button, Box } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import './topnav.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import { shortAddr } from "../../utils/calculation";

const TopNav = () => {
    const openSidebar = () => {
        document.body.classList.add('sidebar-open')
    }
    const { login, account, logout } = useAuth();
    const [open, setOpen] = useState(false)

    const copyAddress = () => {
        navigator.clipboard.writeText(account || "")
    }

    return (
        <div className='topnav'>
            <div className="sidebar-toggle" onClick={openSidebar}>
                <i className='bx bx-menu-alt-right'></i>
            </div>
            {
                !account ?
                    <ConnectWalletBtn variant='contained' size="large" onClick={login}>Connect Wallet</ConnectWalletBtn>
                    :
                    <Box display="flex" fontSize="15px" alignItems="center" style={{ cursor: 'pointer' }} position="relative" onClick={() => { setOpen(!open) }}>
                        <Box bgcolor="#4272d7" color="white" p="10px" px="35px" borderRadius="5px">{shortAddr(account || "")}</Box>
                        <ToggleList display={open ? "flex" : "none"} >
                            <Box component={Button} color="inherit" style={{ textTransform: 'none' }} onClick={copyAddress} startIcon={<ContentCopyIcon />}>Copy Address</Box>
                            <Button
                                color="inherit"
                                style={{ textTransform: 'none' }}
                                startIcon={<OpenInNewIcon />}
                                href={`https://snowtrace.io/address/${account}`}
                                target="_blank"
                            >
                                View on Explorer
                            </Button>
                            <Box component={Button} color="inherit" style={{ textTransform: 'none' }} startIcon={<LogoutIcon />} onClick={logout} >Disconnect</Box>
                        </ToggleList>
                    </Box>
            }
        </div>
    )
}

export default TopNav

const ConnectWalletBtn = styled(Button)`
    &.MuiButton-containedPrimary {
        background-color: #4272d7 !important;
        padding-left: 35px;
        padding-right: 35px;
    }
`

const ToggleList = styled(Box)`
    position: absolute;
    color: white;
    background-color: #4272d7;
    align-items: flex-start;
    flex-direction: column;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 5px 4px 13px 7px #243d74cc;
    z-index: 10;
    top: calc(100% + 5px);
    width: max-content;
    right: 0;
    @media (max-width: 600px) {
        left: 0;
    }

    @media (max-width: 1368px) {
        left: 0;
    }
`