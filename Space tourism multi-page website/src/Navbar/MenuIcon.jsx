export default function MenuIcon({ setMobileSidebarOpen }) {
  return (
    <div onClick={() => setMobileSidebarOpen((open) => (open ? false : true))} className="main-navbar__menu-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" version="1.1">
        <g fill="#d0d6f9" fillRule="evenodd">
          <path d="M0 0h24v3H0z"></path>
          <path d="M0 9h24v3H0z"></path>
          <path d="M0 18h24v3H0z"></path>
        </g>
      </svg>
    </div>
  )
}
