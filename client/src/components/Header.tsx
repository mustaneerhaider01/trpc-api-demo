import { Link } from "react-router";

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-primary text-white h-16 flex items-center justify-between px-5">
      <Link to="/">
        <h2 className="text-xl font-bold tracking-wide uppercase hover:text-blue-100 transition-colors">
          Postgram
        </h2>
      </Link>
      <Link to="/create" className="hover:underline underline-offset-2">
        Add Post
      </Link>
    </header>
  );
}

export default Header;
