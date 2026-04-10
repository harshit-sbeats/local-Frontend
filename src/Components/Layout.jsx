import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Topbar />
      <Sidebar />

      <div className="content-wrapper">
        {children}
      </div>

      <Footer />
    </div>
  );
}
