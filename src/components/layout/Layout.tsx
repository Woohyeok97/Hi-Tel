import { ReactNode } from 'react'
import styles from './Layout.module.scss'
import Navbar from 'components/navbar/Navbar'
import Header from 'components/header/Header'

interface LayoutProps {
    children : ReactNode,
}

export default function Layout({ children } : LayoutProps) {

    return (
        <div className={ styles.layout }>
            <Header/>
            { children }
            <Navbar/>
        </div>
    )
}