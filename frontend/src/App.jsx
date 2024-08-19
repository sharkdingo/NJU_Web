// eslint-disable-next-line no-unused-vars
import { React } from 'react';
import { useParams, Link } from 'react-router-dom';
import Board from './components/Board';
import AvatarUploader from "./components/AvatarUploader.jsx";
import './App.scss';

const App = () => {
    // 使用 useParams 钩子来获取 URL 中的 username 参数
    const { username } = useParams();

    return (
        <div className="app-container">
            <header className="navbar">
                <div className="navbar-brand">Sharkdingo/ Hello {username}</div>

                <nav >
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <AvatarUploader
                            username={username}
                        />
                    </ul>
                </nav>
            </header>

            <main className="main">
                <Board
                    username={username}
                />
            </main>

            <footer className="footer">
                <p>&copy; 2024 Sharkdingo. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
