import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../UI/Header/Header";
import Footer from "../UI/Footer/Footer";

function MainLayout() {
  const location = useLocation();

  // const pathName = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* {pathName !== "/login" && <Header />} */}
      <Header />
      <main>
        <Outlet />
      </main>
      {/* {pathName !== "/login" && <Footer />} */}
      <Footer />
    </>
  );
}

export default MainLayout;
