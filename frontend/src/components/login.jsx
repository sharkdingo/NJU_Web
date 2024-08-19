import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import axios from '../utils/axiosInstance'; // 确保你的 axios 实例正确配置
import '../styles/login.scss'; // 确保使用更新后的 SCSS 文件

const Login = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [isRegistering, setIsRegistering] = useState(false);
        const [error, setError] = useState('');
        const navigate = useNavigate();

        const validateForm = () => {
            if (username.length < 3) {
                setError('Username must be at least 3 characters long');
                return false;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long');
                return false;
            }
            return true;
        };

        const handleLogin = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;
            try {
                // 发起登录请求
                const response = await axios.post('http://127.0.0.1:7001/user/login', {username, password});
                if (response.data.success) {
                    toast.success(response.data.message);
                    navigate(`/${username}`);
                } else if (response.data.isRegister) {
                    setIsRegistering(true); // 显示确认密码输入框
                    toast.info(response.data.message);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error(err);
                // 处理错误（如用户名或密码错误）
                setError('Invalid username or password');
            }
        };

        const handleRegister = async (e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            try {
                const response = await axios.post('http://127.0.0.1:7001/user/register', {username, password});
                if (response.data.success) {
                    toast.success(response.data.message);
                    navigate(`/${username}`);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error(err);
                setError('Registration failed');
            }
        }

        const handleInputChange = (e) => {
            const {name, value} = e.target;
            if (name === 'username') setUsername(value);
            if (name === 'password') setPassword(value);
            if (name === 'confirmPassword') setConfirmPassword(value);
        };

        const handleInputFocus = () => {
            if (error) {
                setError(''); // 清除错误消息
            }
        };

        return (
            <div className="login-container">
                <h1>Sharkdingo</h1>
                <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
                    {error && <div className="error">{error}</div>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                    {isRegistering && (
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                    )}
                    <button type="submit">
                        探索
                    </button>
                </form>
            </div>
        );
    }
;

export default Login;
