import { Link } from "react-router-dom";


function Navbar(){


    return (

        <nav className="navbar">


            <div className="navbar-brand">

                Monad Growth Intelligence · Monad 增长智能分析平台

            </div>



            <div className="navbar-links">


                <Link to="/">
                    首页
                </Link>


                <Link to="/upload">
                    上传
                </Link>


                <Link to="/dashboard">
                    工作区
                </Link>


                <Link to="/reports">
                    报告
                </Link>



            </div>



        </nav>

    );

}


export default Navbar;