
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserCredential } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, userCredentials } = useApp();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mencari peranan yang sepadan dengan kredential yang dimasukkan
    let foundRole: UserRole = null;

    // Fix: Explicitly cast Object.entries to resolve TypeScript 'unknown' type errors for creds
    (Object.entries(userCredentials) as [string, UserCredential][]).forEach(([role, creds]) => {
        if (creds.username === username && creds.password === password) {
            foundRole = role as UserRole;
        }
    });

    if (foundRole) {
        login(username, foundRole);
        onClose();
    } else {
        setError('Nama pengguna atau kata laluan tidak sah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm fade-in">
      <div className="bg-[#1C2541] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-[#C9B458] relative">
        <h2 className="text-2xl font-bold text-center text-white mb-2 font-montserrat">Log Masuk Sistem</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Sila masukkan kelayakan anda untuk akses</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-[#C9B458] mb-1 uppercase tracking-wider">Pengguna</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9B458] transition-colors"
              placeholder="Contoh: admin"
            />
          </div>
          <div>
            <label className="block text-xs text-[#C9B458] mb-1 uppercase tracking-wider">Kata Laluan</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9B458] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded border border-red-900">{error}</p>}

          <div className="flex gap-4 pt-4">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-black hover:bg-yellow-500 shadow-lg shadow-yellow-900/20 transition-all hover:scale-[1.02]"
            >
              LOG MASUK
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
           Portal Pengurusan Digital SMAAM
        </div>
      </div>
    </div>
  );
};
