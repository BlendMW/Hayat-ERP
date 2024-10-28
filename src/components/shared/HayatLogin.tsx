import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HayatLoginProps {
  onLogin: () => void;
}

const HayatLogin: React.FC<HayatLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your login logic here
    onLogin();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
    navigate(from);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default HayatLogin;
