import { useEffect, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Github, Sparkles } from 'lucide-react';
import type { Empresa, Vaga } from '../shared/tipos';
import { useCandidato } from '../shared/candidato';
import { useToast } from '../shared/toast';
import * as db from '../shared/db';

interface Props {
  vaga: Vaga | null;
  empresa: Empresa | null;
  onFechar: () => void;
}

const MAX_SOBRE = 280;

export default function ModalCV({ vaga, empresa, onFechar }: Props) {
  const skillsSalvas = useCandidato((s) => s.skills);
  const sobreSalva = useCandidato((s) => s.sobre);
  const githubSalvo = useCandidato((s) => s.github);
  const salvarCV = useCandidato((s) => s.salvarCV);
  const registrarCandidatura = useCandidato((s) => s.registrarCandidatura);
  const mostrarToast = useToast((s) => s.mostrar);

  const [skills, setSkills] = useState<string[]>(skillsSalvas);
  const [skillInput, setSkillInput] = useState('');
  const [sobre, setSobre] = useState(sobreSalva);
  const [github, setGithub] = useState(githubSalvo);
  const [erro, setErro] = useState<string | null>(null);

  // Re-hidrata sempre que abrir com vaga nova (mantém o que o user já tinha digitado em outras candidaturas)
  useEffect(() => {
    if (vaga) {
      setSkills(skillsSalvas);
      setSobre(sobreSalva);
      setGithub(githubSalvo);
      setErro(null);
    }
  }, [vaga, skillsSalvas, sobreSalva, githubSalvo]);

  // ESC fecha
  useEffect(() => {
    if (!vaga) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [vaga, onFechar]);

  const adicionarSkill = () => {
    const limpa = skillInput.trim();
    if (!limpa) return;
    if (skills.some((s) => s.toLowerCase() === limpa.toLowerCase())) {
      setSkillInput('');
      return;
    }
    setSkills((s) => [...s, limpa]);
    setSkillInput('');
  };

  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      adicionarSkill();
    } else if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
      setSkills((s) => s.slice(0, -1));
    }
  };

  const removerSkill = (skill: string) => {
    setSkills((s) => s.filter((x) => x !== skill));
  };

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaga || !empresa) return;

    if (skills.length === 0) {
      setErro('Adicione pelo menos uma skill.');
      return;
    }
    if (!sobre.trim()) {
      setErro('Conta um pouco sobre você.');
      return;
    }
    setErro(null);

    salvarCV({ skills, sobre: sobre.trim(), github: github.trim() });
    registrarCandidatura(vaga.id);
    const { id } = useCandidato.getState();
    if (id) db.syncCandidatura(id, skills, sobre.trim(), github.trim(), vaga, empresa);
    mostrarToast(`CV entregue pra ${empresa.nome}. Boa sorte!`, 'sucesso');
    onFechar();
  };

  const cor = empresa?.cor ?? '#00D4FF';

  return (
    <AnimatePresence>
      {vaga && empresa && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/80 backdrop-blur-md"
          onClick={onFechar}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl border bg-bg-panel/95 backdrop-blur shadow-2xl overflow-hidden"
            style={{
              borderColor: `${cor}66`,
              boxShadow: `0 0 60px ${cor}44`
            }}
          >
            {/* Header */}
            <div
              className="relative px-6 py-5 border-b"
              style={{ borderColor: `${cor}33` }}
            >
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-bright hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: cor }} />
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: cor }}
                >
                  Entregar CV
                </span>
              </div>
              <h2 className="font-display text-2xl text-text-bright leading-tight">
                {vaga.titulo}
              </h2>
              <p className="text-sm text-text-dim mt-1">
                <span style={{ color: cor }}>{empresa.nome}</span> · {vaga.senioridade}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submeter} className="overflow-y-auto px-6 py-5 space-y-5">
              {/* Skills */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim mb-2">
                  Skills
                </label>
                <div
                  className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border bg-bg-elev/60 transition focus-within:border-text-bright/30"
                  style={{ borderColor: `${cor}33` }}
                >
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border"
                      style={{
                        borderColor: `${cor}55`,
                        background: `${cor}15`,
                        color: cor
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removerSkill(skill)}
                        className="opacity-70 hover:opacity-100"
                        aria-label={`Remover ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKey}
                    onBlur={adicionarSkill}
                    placeholder={skills.length === 0 ? 'React, TypeScript, Go… (Enter pra adicionar)' : ''}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text-bright placeholder:text-text-muted py-1"
                  />
                </div>
              </div>

              {/* Sobre */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim">
                    Sobre
                  </label>
                  <span
                    className={`text-[10px] ${
                      sobre.length > MAX_SOBRE ? 'text-neon-magenta' : 'text-text-muted'
                    }`}
                  >
                    {sobre.length} / {MAX_SOBRE}
                  </span>
                </div>
                <textarea
                  value={sobre}
                  onChange={(e) => setSobre(e.target.value.slice(0, MAX_SOBRE))}
                  rows={4}
                  placeholder="Em 2 ou 3 frases: o que você curte construir, onde quer chegar."
                  className="w-full px-3 py-2 rounded-lg border bg-bg-elev/60 text-sm text-text-bright placeholder:text-text-muted outline-none transition resize-none focus:border-text-bright/30"
                  style={{ borderColor: `${cor}33` }}
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-text-dim mb-2">
                  GitHub <span className="text-text-muted normal-case tracking-normal">(opcional)</span>
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-bg-elev/60 transition focus-within:border-text-bright/30"
                  style={{ borderColor: `${cor}33` }}
                >
                  <Github className="w-4 h-4 text-text-dim shrink-0" />
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/seuuser"
                    className="flex-1 bg-transparent outline-none text-sm text-text-bright placeholder:text-text-muted"
                  />
                </div>
              </div>

              {erro && (
                <p className="text-sm text-neon-magenta">{erro}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onFechar}
                  className="px-4 py-2 rounded-lg text-sm text-text-dim hover:text-text-bright transition"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-display text-sm tracking-[0.15em] uppercase font-bold text-bg-deep transition"
                  style={{
                    background: cor,
                    boxShadow: `0 0 28px ${cor}66`
                  }}
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
