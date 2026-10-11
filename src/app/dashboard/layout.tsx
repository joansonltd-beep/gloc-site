import './dashboard.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Private Activity Tracker',robots:{index:false,follow:false},referrer:'same-origin'};
export default function Layout({children}:{children:React.ReactNode}){return <div className="tracker-shell">{children}</div>}
