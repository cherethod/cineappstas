// components/UserLogin.jsx
import { useState } from 'react';

export function UserLogin({ authToSupabase, setRegisterUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authToSupabase(username, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
      <h2 className='mb-6 text-2xl font-bold text-center text-gray-800'>Iniciar sesión</h2>
      
      {error && (
        <div className='p-3 mb-4 text-red-700 bg-red-100 rounded-md'>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
          />
        </div>
        
        <div className='mb-6'>
          <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-700'>
            Contraseña
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
          />
        </div>
        
        <button
          type='submit'
          disabled={loading}
          className={`w-full py-2 text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
      
      <div className='mt-4 text-center'>
        <button
          onClick={() => setRegisterUser(true)}
          className='text-indigo-600 hover:text-indigo-800'
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
}