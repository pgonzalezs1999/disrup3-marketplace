import { FC, ReactNode } from "react"
import Navbar from "../Navbar";
import Footer from "../Footer";

interface Props {
    children?: ReactNode;
}

const MainLayout: FC<Props> = ({children}) => {
  return (
    <div className="flex flex-col justify-between h-[100vh]">
        <Navbar/>
            {children}     
        <Footer />      
    </div>
   
  )
}

export default MainLayout