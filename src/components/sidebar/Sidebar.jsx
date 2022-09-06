import React, { useEffect, useState } from 'react'
import './sidebar.scss'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import sidebarNav from '../../configs/sidebarNav'
import _ from 'lodash';
import { Box } from '@mui/material'

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [openSubTabInfo, setSubTabInfo] = useState({});
    const location = useLocation()

    useEffect(()=>{
        const subTabInfo = {}
        _.map(sidebarNav, (item, index)=>{
            if(item.subTab) {
                _.set(subTabInfo, index, false)
            }
        })
        setSubTabInfo(subTabInfo)
    }, [])

    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1]
        const activeItem = sidebarNav.findIndex(item => item.subTab ? _.includes(item.link, '/'+curPath) : item.section === curPath)
        setActiveIndex(curPath.length === 0 ? 0 : activeItem)
    }, [location])

    const closeSidebar = () => {
        document.querySelector('.main__content').style.transform = 'scale(1) translateX(0)'
        setTimeout(() => {
            document.body.classList.remove('sidebar-open')
            document.querySelector('.main__content').style = ''
        }, 500);
    }

    const openSubTab = (index) => (e) => {
        e.stopPropagation();
        const r = _.cloneDeep(openSubTabInfo)
        _.set(r, index, !_.get(r, index))
        setSubTabInfo(r)
    }
    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={logo} alt="" />
                <div className="sidebar-close" onClick={closeSidebar}>
                    <i className='bx bx-x'></i>
                </div>
            </div>
            <div className="sidebar__menu">
                {
                    sidebarNav.map((nav, index) => {
                        return !nav.subTab ? <Link to={nav.link} key={`nav-${index}`} className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={closeSidebar}>
                            <div className="sidebar__menu__item__icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar__menu__item__txt">
                                {nav.text}
                            </div>
                        </Link> : 
                        <Box 
                            key={`nav-${index}`} 
                            style={{cursor: 'pointer'}}
                            display="flex"
                            flexDirection='column'
                            alignItems="flex-start"
                        >
                            <Box display="flex" alignItems='center' className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={openSubTab(index)} >
                                <div className="sidebar__menu__item__icon">
                                    {nav.icon}
                                </div>
                                <div className="sidebar__menu__item__txt">
                                    {nav.text}
                                </div>
                            </Box>
                            <Box 
                                display="flex" 
                                flexDirection="column" 
                                alignItems='stretch' 
                                flexGrow={1} 
                                className="sub_container"
                                height={openSubTabInfo[`${index}`] ? `${58 * nav.link.length}px` : '0px'}
                                overflow="hidden"
                                style={{
                                    transition: 'height 0.2s'
                                }}
                            >
                                {
                                    _.map(nav.link, (item, i)=>{
                                        const active = item === window.location.pathname;
                                        return <Link 
                                            className={`sidebar__menu__item ${active ? 'selected_sub_tab' : ''}`}
                                            key={`itm-${i}`} 
                                            to={item} 
                                            onClick={closeSidebar}
                                            style={{fontWeight: active? '700' : '', padding: 'unset'}}
                                        >
                                            <div className="sidebar__menu__item__txt">
                                                {nav.subTextList[i]}
                                            </div>
                                        </Link>
                                    })
                                }
                            </Box>
                        </Box>
                        }
                    )
                }
                <div className="sidebar__menu__item">
                    
                    <div className="sidebar__menu__item__txt">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
