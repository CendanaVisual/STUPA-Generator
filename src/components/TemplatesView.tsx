import React from 'react';
import {
  DOCUMENT_TEMPLATES
} from '../data/templates';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Leaf,
  Calculator,
  FileQuestion,
  Recycle,
  HeartHandshake,
  BookOpenCheck,
} from 'lucide-react';
import { DocumentTemplate, DocFormData } from '../types';

interface TemplatesViewProps {
  onSelectTemplate: (template: DocumentTemplate) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Leaf,
  Calculator,
  FileQuestion,
  Recycle,
  HeartHandshake,
  BookOpenCheck,
};

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Koleksi Template Pilihan Kurikulum Merdeka</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Template Siap Pakai untuk Semua Jenjang
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Pilih template di bawah ini untuk mengisi formulir secara otomatis dengan topik & model pembelajaran teruji. Tinggal sesuaikan dan generasi!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENT_TEMPLATES.map((tmpl) => {
          const IconComponent = ICON_MAP[tmpl.icon] || BookOpen;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {tmpl.grade}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Gunakan Template Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
