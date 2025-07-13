import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import bcrypt from 'bcryptjs';
import { UserLogin } from './components/UserLogin';
import { UserRegister } from './components/UserRegister';
import { MainApp } from './components/MainApp';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registerUser, setRegisterUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        
        try {
          // Verificar si el usuario sigue siendo válido
          const isValid = await verifyUserSession(user.id);
          if (isValid) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem('currentUser');
          }
        } catch (error) {
          console.error('Error verificando sesión:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Verificar si el usuario actual es válido al cambiar `currentUser`
  useEffect(() => {
    if (currentUser) {
      verifyUserSession(currentUser.id)
        .then(isValid => {
          console.log('Usuario verificado:', isValid);
        
          if (!isValid) {
            setCurrentUser(null);
            localStorage.removeItem('currentUser');
          }
        })
        .catch(error => {
          console.error('Error verificando sesión del usuario:', error);
          setCurrentUser(null);
          localStorage.removeItem('currentUser');
        });
    }
  }, [currentUser]);

  // Verificar la sesión del usuario en Supabase
  const verifyUserSession = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();
      
      return !error && data;
    } catch (error) {
      console.error('Error verificando usuario:', error);
      return false;
    }
  };

  // Función para autenticar usuario
  const authToSupabase = async (username, password) => {
    setLoading(true);
    
    try {
      // Buscar usuario por nombre
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (userError || !userData) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, userData.password_hash);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }

      // Actualizar última actividad
      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', userData.id);

      // Crear objeto de usuario seguro (sin password_hash)
      const safeUser = {
        id: userData.id,
        username: userData.username,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at
      };

      // Guardar en estado y localStorage
      setCurrentUser(safeUser);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      return safeUser;
      
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-8 min-h-screen bg-gray-100 ${!currentUser ? 'justify-center' : ''}`}>
     
      
      {currentUser ? (
        <>
     
       <MainApp 
          currentUser={currentUser}
          handleLogout={handleLogout}
          setCurrentUser={setCurrentUser}
          setQuery={setQuery}
       />  
        </>
      ) : registerUser ? (
        <UserRegister
          setCurrentUser={setCurrentUser}
          setRegisterUser={setRegisterUser}
          supabase={supabase}
        />
      ) : (
        <UserLogin
          authToSupabase={authToSupabase}
          setRegisterUser={setRegisterUser}
        />
      )}
    </div>
  );
}

export default App;