export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="PARKT">PARKT</a>
        <ul>
            <li className="active">
                <a href="/map">Map</a>
            </li>
            <li>
                <a href="/table">Table</a>
            </li>
        </ul>
    </nav>
}