import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <nav className="container">
        <div className="logo">
          <Link href='/'>
            Tic Tac Toe
          </Link>
        </div>
        <div className="links">
          <Link href='/about'>About
          </Link>
          <Link href='/about/team'>Team
          </Link>
          <Link href='/playNow'>Play
          </Link>
          <Link href='/scores'>Scores
          </Link>
          <Link href='/rooms'>Rooms
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header;