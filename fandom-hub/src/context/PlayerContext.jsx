import { createContext, useState, useEffect, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('fandomHubUsers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fandomHubCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('fandomHubUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fandomHubCurrentUser', JSON.stringify(currentUser));
      setUsers(prevUsers => prevUsers.map(u => u.username === currentUser.username ? currentUser : u));
    } else {
      localStorage.removeItem('fandomHubCurrentUser');
    }
  }, [currentUser]);

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return { success: false, message: "Auto to onoma uparxei hdh!" };
    }
    if (username.length < 3 || password.length < 3) {
      return { success: false, message: "To onoma kai o kwdikos prepei na exoun 3+ grammata." };
    }

    const newUser = {
      username,
      password,
      tickets: 0,
      avatar: "👾",
      unlockedAvatars: ["👾"]
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: "Lathos onoma h kwdikos!" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTickets = (amount) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, tickets: currentUser.tickets + amount });
    }
  };

  const buyAvatar = (avatar, cost) => {
    if (currentUser && currentUser.tickets >= cost) {
      if (!currentUser.unlockedAvatars.includes(avatar)) {
        setCurrentUser({
          ...currentUser,
          tickets: currentUser.tickets - cost,
          unlockedAvatars: [...currentUser.unlockedAvatars, avatar]
        });
        return true; 
      }
    }
    return false; 
  };

  const equipAvatar = (avatar) => {
    if (currentUser && currentUser.unlockedAvatars.includes(avatar)) {
      setCurrentUser({ ...currentUser, avatar: avatar });
    }
  };

  // --- NEES LEITOURGIES GIA THEMES KAI VIP GAMES ---

  const buyTheme = (theme, cost) => {
    const unlockedT = currentUser.unlockedThemes || ['default'];
    if (currentUser && currentUser.tickets >= cost && !unlockedT.includes(theme)) {
      setCurrentUser({
        ...currentUser,
        tickets: currentUser.tickets - cost,
        unlockedThemes: [...unlockedT, theme]
      });
      return true;
    }
    return false;
  };

  const equipTheme = (theme) => {
    const unlockedT = currentUser.unlockedThemes || ['default'];
    if (currentUser && unlockedT.includes(theme)) {
      setCurrentUser({ ...currentUser, currentTheme: theme });
    }
  };

  const buyGame = (gameId, cost) => {
    const unlockedG = currentUser.unlockedGames || [];
    if (currentUser && currentUser.tickets >= cost && !unlockedG.includes(gameId)) {
      setCurrentUser({
        ...currentUser,
        tickets: currentUser.tickets - cost,
        unlockedGames: [...unlockedG, gameId]
      });
      return true;
    }
    return false;
  };

  return (
    <PlayerContext.Provider value={{ 
      currentUser, register, login, logout, addTickets, 
      buyAvatar, equipAvatar, buyTheme, equipTheme, buyGame 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};