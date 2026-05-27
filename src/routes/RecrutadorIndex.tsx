import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, ArrowLeft, Eye } from 'lucide-react';
import { useEmpresas } from '../shared/db';
import { useAuth } from '../shared/auth';
import ParticulasBg from '../shared/ParticulasBg';
import SeletorQualidade from '../components/SeletorQualidade';

export default function RecrutadorIndex() {
  const navigate = useNavigate();
  const usuario = useAuth((s) => s.usuario);
  // `useEmpresas` já tem fallback pro mock quando sem Supabase ou enquanto carrega.
  const { dados: empresas } = useEmpresas();

  // Recrutador logado vai direto pro próprio painel.
  useEffect(() => {
    if (usuario?.tipo === 'recrutador' && usuario.empresaSlug) {
      navigate(`/recrutador/${usuario.empresaSlug}`, { replace: true });
    }
  }, [usuario, navigate]);
  return (
    <div className="relative min-h-screen bg-bg-deep overflow-hidden">
      <ParticulasBg densidade="baixa" />

      <div className="relative z-10 p-6 md:p-10 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-dim hover:text-neon-cyan transition mb-10"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-magenta/30 bg-neon-magenta/5 backdrop-blur-sm mb-6">
            <Briefcase className="w-4 h-4 text-neon-magenta" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-neon-magenta">
              Painel do recrutador
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-glow-magenta">
            Qual empresa você representa?
          </h1>
          <p className="text-text-dim mb-6 max-w-xl">
            Selecione o estande pra ver os CVs recebidos, engajamento no
            ambiente 3D e (em breve) análise de match por IA.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-2 mb-8 rounded-full border border-neon-magenta/25 bg-neon-magenta/5 backdrop-blur text-[11px] uppercase tracking-[0.2em]">
            <Eye className="w-3.5 h-3.5 text-neon-magenta" />
            <span className="text-text-dim normal-case tracking-normal">
              Esta visualização é pública. Pra ter painel próprio,{' '}
              <Link to="/" className="text-neon-magenta underline-offset-2 hover:underline">
                cadastre-se na landing
              </Link>
              .
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {empresas.map((empresa, i) => (
              <motion.div
                key={empresa.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  to={`/recrutador/${empresa.slug}`}
                  className="group block rounded-xl border border-neon-cyan/15 bg-bg-panel/60 backdrop-blur p-5 hover:border-neon-cyan/50 transition relative overflow-hidden"
                  style={{
                    boxShadow: `0 0 0 0 ${empresa.cor}00`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 28px ${empresa.cor}44`;
                    e.currentTarget.style.borderColor = `${empresa.cor}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 0 ${empresa.cor}00`;
                    e.currentTarget.style.borderColor = '';
                  }}
                >
                  {/* Faixa de cor lateral */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: empresa.cor, boxShadow: `0 0 12px ${empresa.cor}` }}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <h2
                      className="font-display text-xl font-bold leading-tight"
                      style={{ color: empresa.cor, textShadow: `0 0 10px ${empresa.cor}55` }}
                    >
                      {empresa.nome}
                    </h2>
                    <ArrowRight
                      className="w-4 h-4 text-text-dim group-hover:translate-x-1 transition-transform mt-1.5"
                      style={{ color: empresa.cor }}
                    />
                  </div>

                  <p className="text-sm text-text-dim mb-4 leading-snug min-h-[2.5rem]">
                    {empresa.missao}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {empresa.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full border text-text-bright"
                        style={{
                          borderColor: `${empresa.cor}55`,
                          background: `${empresa.cor}10`
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted mt-10 max-w-xl">
            Acesso ao painel é livre no MVP do hackathon. Em produção, cada
            empresa teria autenticação isolada (auth + RLS no Supabase).
          </p>
        </motion.div>
      </div>

      <SeletorQualidade posicao="bottom-left" />
    </div>
  );
}
