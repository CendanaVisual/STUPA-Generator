import React, { useState } from 'react';
import { X, User, School, Mail, Key, Sparkles, CheckCircle2 } from 'lucide-react';
import { TeacherProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (user: TeacherProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
}) => {
  const [name, setName] = useState<string>('Ni Made Sri Wahyuni, S.Pd.');
  const [email, setEmail] = useState<string>('sdn7pedungan63@gmail.com');
  const [sekolah, setSekolah] = useState<string>('SD Negeri 07 Pedungan');
  const [nip, setNip] = useState<string>('198504122010012015');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Ilmu Pengetahuan Alam (IPA)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: TeacherProfile = {
      id: `usr_${Date.now()}`,
      email,
      name,
      nip,
      sekolah,
      mataPelajaranUtama: mataPelajaran,
      joinedAt: new Date().toISOString(),
      plan: 'premium',
      quotaLeft: 999,
    };
    onSignInSuccess(newUser);
    onClose();
  };

  const handleQuickDemoUser = () => {
    const demoUser: TeacherProfile = {
      id: 'usr_pedungan_official',
      email: 'sdn7pedungan63@gmail.com',
      name: 'Ni Made Sri Wahyuni, S.Pd.',
      nip: '198504122010012015',
      sekolah: 'SD Negeri 07 Pedungan',
      mataPelajaranUtama: 'Ilmu Pengetahuan Alam (IPA)',
      joinedAt: new Date().toISOString(),
      plan: 'premium',
      quotaLeft: 999,
    };
    onSignInSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Masuk Akun Guru STUPA
          </h3>
          <p className="text-xs text-slate-500">
            Lengkapi data diri guru untuk dimasukkan otomatis ke dokumen RPP/Modul
          </p>
        </div>

        {/* Quick Demo Button */}
        <button
          type="button"
          onClick={handleQuickDemoUser}
          className="w-full py-2.5 px-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center justify-between hover:bg-blue-100 transition-colors"
        >
          <div className="text-left">
            <p className="font-extrabold">Ni Made Sri Wahyuni, S.Pd.</p>
            <p className="text-[10px] text-blue-500">SD Negeri 07 Pedungan (sdn7pedungan63@gmail.com)</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
        </button>

        <div className="relative text-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-800 text-[10px] text-slate-400 uppercase font-bold">
            Atau Isi Manual Data Guru
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ni Made Sri Wahyuni, S.Pd."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Satuan Pendidikan (Sekolah)
            </label>
            <input
              type="text"
              required
              value={sekolah}
              onChange={(e) => setSekolah(e.target.value)}
              placeholder="Contoh: SD Negeri 07 Pedungan"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP (Opsional)
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="1985..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@sekolah.sch.id"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all mt-2"
          >
            Simpan Profil & Masuk
          </button>
        </form>
      </div>
    </div>
  );
};
