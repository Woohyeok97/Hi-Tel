import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
// components
import Navbar from 'components/navbar/Navbar'

interface LayoutProps {
    children : ReactNode,
}


export default function Layout({ children } : LayoutProps) {

    return (
        <div className="relative min-h-screen w-[600px] mx-auto pt-[80px] pb-[120px] lg:w-full lg:p-0">
            {/* 헤더 : 태블릿, 모바일 버전일때 렌더링 */}
            <div className='fixed top-0 max-w-[600px] w-full h-[80px] lg:hidden'>
                <header className='shadow-border bg-bgColor flex justify-center items-center p-3 text-5xl mx-3'>
                    <Link to={'/'}>HI-TEL</Link>
                </header>
            </div>

            <div className="p-3 lg:ml-[20%] lg:m-0 lg:py-20 lg:px-[10%] lg:overflow-y-auto">
                {children}
            </div>

            <div className='flex flex-col fixed bottom-0 max-w-[600px] w-full  lg:h-full lg:left-0 lg:top-0 lg:max-w-[20%] lg:border-r-3'>
                {/* 헤더 : 데스크탑 버전일때만 렌더링 */}
                <header className='hidden text-5xl text-center py-10 lg:block'>
                    <Link to={'/'}>HI-TEL</Link>
                </header>
                <Navbar/>
            </div>
        </div>
    )

    // return (
    //     <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr,2fr] lg:grid-rows-[auto,1fr]">
    //         <div className="lg:col-span-3 lg:row-span-1">
    //             <header className='shadow-border p-6 mb-10'>
    //                 <h1 className='text-5xl text-center'>
    //                     HI-TEL
    //                 </h1>
    //             </header>
    //         </div>

    //         <div className="lg:col-start-2 lg:col-span-2 lg:row-start-2 lg:row-span-2">
    //             { children }
    //         </div>

    //         <div className="lg:col-start-1 lg:row-start-2">
    //             <Navbar/>
    //         </div>
    //     </div>
    // )
}