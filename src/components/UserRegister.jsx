import { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import bcrypt from 'bcryptjs';

export const UserRegister = ({ setCurrentUser, setRegisterUser, supabase }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar formato de username
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('El nombre de usuario solo puede contener letras, números y guiones bajos (3-20 caracteres)');
      setLoading(false);
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Generar hash de la contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Insertar nuevo usuario
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{ 
          username, 
          password_hash: passwordHash,
          avatar_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        }])
        .select('id, username, avatar_url, created_at');
      
      if (insertError) {
        throw new Error(`Error en Supabase: ${insertError.message}`);
      }

      // Devolver datos del usuario creado
      const newUser = data[0];
      console.log('Usuario creado exitosamente:', newUser);
      
      setCurrentUser({
        id: newUser.id,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        created_at: newUser.created_at
      });
      
    } catch (error) {
      console.error('Error en registro:', error.message);
      setError(error.message);
      
      // Manejar errores específicos de Supabase
      if (error.code === '23505') {
        setError('El nombre de usuario ya está registrado');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
      <h2 className='mb-6 text-2xl font-bold text-center text-gray-800'>Crear cuenta</h2>
      
      {error && (
        <div className='p-3 mb-4 text-red-700 bg-red-100 rounded-md'>
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className='mb-4'>
          <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-700'>
            Nombre de usuario
          </label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
            placeholder="Ingresa tu usuario"
          />
        </div>
        
        <div className='mb-4'>
          <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-700'>
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </button>
          </div>
          <p className='mt-1 text-xs text-gray-500'>Mínimo 6 caracteres</p>
        </div>
        
        <div className='mb-6'>
          <label htmlFor='confirmPassword' className='block mb-2 text-sm font-medium text-gray-700'>
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
              placeholder="Confirma tu contraseña"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </button>
          </div>
        </div>
        
        <button
          type='submit'
          disabled={loading}
          className={`w-full py-2 text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>
      
      <div className='mt-4 text-center'>
        <button
          onClick={() => setRegisterUser(false)}
          className='text-indigo-600 hover:text-indigo-800'
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};