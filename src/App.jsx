import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import bcrypt from 'bcryptjs';
import { UserLogin } from './components/UserLogin';
import { UserRegister } from './components/UserRegister';
import {
  searchTvShows,
  searchMovies,
} from './components/services/tdbmAPI';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registerUser, setRegisterUser] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Verificar si el usuario actual es válido al cambiar
    if (currentUser) {
      verifyUserSession(currentUser.id)
        .then(isValid => {
          console.log('Usuario verificado:', isValid);
          searchMovies('Inception');
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
    <div className='flex flex-col items-center gap-8 justify-center min-h-screen bg-gray-100'>
      <h1 className='text-5xl font-bold text-indigo-700'>CineAppstas</h1>
      
      {currentUser ? (
        <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <img 
                src={currentUser.avatar_url} 
                alt={currentUser.username} 
                className='w-12 h-12 rounded-full'
              />
              <div>
                <h2 className='text-xl font-semibold'>{currentUser.username}</h2>
                <p className='text-sm text-gray-500'>
                  Miembro desde {new Date(currentUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
            >
              Cerrar sesión
            </button>
          </div>
          
          {
          // TODO: CONTENTO PRINCIPAL DE LA APLICACIÓN
          }
          <div className='p-4 text-center bg-gray-50 rounded-lg'>
            <h3 className='text-lg font-medium'>Bienvenido a CineAppstas</h3>
            <p className='mt-2 text-gray-600'>
              Aquí podrás gestionar tus películas y series favoritas
            </p>
          </div>
        </div>
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