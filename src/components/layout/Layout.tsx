import { ReactNode } from 'react'

import Navbar from 'components/navbar/Navbar'
import Header from 'components/header/Header'

interface LayoutProps {
    children : ReactNode,
}

export default function Layout({ children } : LayoutProps) {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr,2fr] lg:grid-rows-[auto,1fr]">
            <div className="lg:col-span-1 lg:row-span-1">
                <Header/>
            </div>
            <div className="lg:col-span-2 lg:row-span-2">
                { children }
            </div>
            <div className="lg:col-start-1 lg:row-span-1">
                <Navbar/>
            </div>
        </div>
    )
}