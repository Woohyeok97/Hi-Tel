import { ReactNode } from 'react'
import styles from './Layout.module.scss'
import Navbar from 'components/navbar/Navbar'

interface LayoutProps {
    children : ReactNode,
}

export default function Layout({ children } : LayoutProps) {

    return (
        <div className={ styles.layout }>
            { children }
            <Navbar/>
        </div>
    )
}