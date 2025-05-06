import './Overlay.css'

const Overlay = ({ menuOpen, sidebarOpen, setMenuOpen, setSidebarOpen}) => {
    return (
        <div
        className="overlay"
        data-menu-open={menuOpen}
        data-sidebar-open={sidebarOpen}
        onClick={() => {
          setMenuOpen(false);
          setSidebarOpen(false);
        }}
      />);
};

export default Overlay