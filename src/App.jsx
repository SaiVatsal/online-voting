import React, { useState } from 'react';
import {
  Vote,
  ShieldCheck,
  Award,
  Landmark,
  CheckCircle2,
  Lock,
  Unlock,
  FileText,
  PieChart,
  Users,
  Activity,
  Layers,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Stamp
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    activeRole,
    setActiveRole,
    currentVoter,
    electionState,
    proposals,
    auditTrail,
    castBallot,
    togglePolls
  } = useStore();

  const [activeTab, setActiveTab] = useState('ballot');
  const [selectedVotes, setSelectedVotes] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleVoteSelect = (proposalId, candidateId) => {
    setSelectedVotes({ ...selectedVotes, [proposalId]: candidateId });
  };

  const handleConfirmBallot = () => {
    castBallot(selectedVotes);
    setShowConfirmation(false);
  };

  const allVoted = proposals.every((p) => selectedVotes[p.id]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between">
      {/* Formal Civic Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-500/40 flex items-center justify-center text-red-500 font-cinzel text-xl font-bold shadow-lg">
              <Landmark className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <span className="font-cinzel text-base font-bold tracking-widest text-slate-100 block leading-none">
                CIVITAS COMMISSION
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-semibold">
                Cryptographic Ballot Authority
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-[#1e293b] p-1 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveTab('ballot')}
              className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'ballot' ? 'bg-red-900 text-white font-bold border border-red-700' : 'hover:text-white'}`}
            >
              Official Ballot
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'audit' ? 'bg-red-900 text-white font-bold border border-red-700' : 'hover:text-white'}`}
            >
              Audit Trail ({auditTrail.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'results' ? 'bg-red-900 text-white font-bold border border-red-700' : 'hover:text-white'}`}
            >
              Results & Turnout
            </button>
          </div>

          {/* Role & Poll Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block">{currentVoter.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {currentVoter.hasVoted ? '✓ Ballot Cast' : '● Verified Elector'}
              </span>
            </div>

            <button
              onClick={() => setActiveRole(activeRole === 'voter' ? 'commissioner' : 'voter')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition"
            >
              {activeRole === 'voter' ? 'Commissioner View' : 'Voter View'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Civic Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        {/* Turnout Telemetry Meter */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${
                electionState.status === 'POLLS_OPEN'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                ● {electionState.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400">Closes {electionState.closeTime}</span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1.5 font-serif-ballot">{electionState.title}</h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-2xl text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-mono text-slate-400">Turnout Count</span>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {electionState.turnoutCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-2xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-mono text-slate-400">Participation</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {electionState.turnoutRate}
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: OFFICIAL BALLOT SHEET */}
        {activeTab === 'ballot' && (
          <div className="space-y-6">
            {currentVoter.hasVoted ? (
              /* Receipt Seal Card */
              <div className="bg-[#1e293b] border-2 border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border-2 border-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    Official Cryptographic Vote Confirmation
                  </span>
                  <h2 className="text-2xl font-bold text-white font-serif-ballot mt-1">
                    Ballot Successfully Cast & Sealed
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Your single-use electronic ballot has been cryptographically signed and appended to the immutable municipal ledger.
                  </p>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">SHA-256 Ballot Receipt Token:</div>
                  <div className="text-emerald-400 break-all">{currentVoter.ballotReceiptHash}</div>
                  <div className="text-slate-500 text-[10px] pt-1">
                    Voter ID: {currentVoter.voterId} • Jurisdiction: {currentVoter.jurisdiction}
                  </div>
                </div>
              </div>
            ) : (
              /* Voting Form */
              <div className="space-y-6">
                {proposals.map((prop, idx) => (
                  <div key={prop.id} className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider">
                          Section {idx + 1} // {prop.type}
                        </span>
                        <h3 className="text-lg font-bold text-white font-serif-ballot mt-0.5">{prop.title}</h3>
                      </div>
                      <span className="text-xs text-slate-400">{prop.description}</span>
                    </div>

                    <div className="space-y-3">
                      {prop.candidates.map((cand) => {
                        const isSelected = selectedVotes[prop.id] === cand.id;
                        return (
                          <div
                            key={cand.id}
                            onClick={() => handleVoteSelect(prop.id, cand.id)}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                              isSelected
                                ? 'bg-red-950/40 border-red-600 shadow-md'
                                : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                              isSelected ? 'border-red-500 bg-red-600 text-white' : 'border-slate-600'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white text-sm">{cand.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                                  {cand.party}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-serif-ballot italic">
                                "{cand.manifesto}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Ballot Submission Button */}
                <div className="p-6 bg-[#1e293b] border border-slate-800 rounded-3xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Ready to seal your vote?</h4>
                    <p className="text-xs text-slate-400">Single-use encrypted transmission cannot be reversed once signed.</p>
                  </div>
                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={!allVoted}
                    className="px-6 py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-700/30"
                  >
                    Cast Encrypted Ballot
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif-ballot">Tamper-Evident Cryptographic Ledger</h2>
                <p className="text-xs text-slate-400 mt-0.5">SHA-256 block hash chaining verifying all recorded voting transactions</p>
              </div>

              <div className="space-y-3">
                {auditTrail.map((block) => (
                  <div key={block.id} className="p-4 bg-[#0f172a] rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-2 text-red-400 font-bold">
                        <span>{block.id}</span>
                        <span className="text-slate-500 font-normal">({block.timestamp})</span>
                      </div>
                      <div className="text-slate-300 mt-1 break-all">Block Hash: {block.hash}</div>
                      <div className="text-slate-500 text-[10px]">Parent Hash: {block.prevHash}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold self-start sm:self-auto">
                      {block.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RESULTS & COMMISSIONER CONTROLS */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif-ballot">Official Tabulation & Vote Tallies</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time vote count breakdown per electoral proposition</p>
                </div>

                {activeRole === 'commissioner' && (
                  <button
                    onClick={togglePolls}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      electionState.status === 'POLLS_OPEN'
                        ? 'bg-rose-700 hover:bg-rose-600 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {electionState.status === 'POLLS_OPEN' ? 'Close Polls Officially' : 'Re-Open Voting Period'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {proposals.map((prop) => {
                  const totalPropVotes = prop.candidates.reduce((sum, c) => sum + c.votes, 0);
                  return (
                    <div key={prop.id} className="bg-[#0f172a] rounded-2xl p-5 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm font-serif-ballot">{prop.title}</h4>
                        <span className="text-xs font-mono text-slate-400">{totalPropVotes.toLocaleString()} Total Ballots</span>
                      </div>

                      <div className="space-y-3">
                        {prop.candidates.map((cand) => {
                          const pct = totalPropVotes > 0 ? ((cand.votes / totalPropVotes) * 100).toFixed(1) : 0;
                          return (
                            <div key={cand.id} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-200">{cand.name}</span>
                                <span className="font-mono text-slate-400">{cand.votes.toLocaleString()} votes ({pct}%)</span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: BALLOT CONFIRMATION */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500 mx-auto flex items-center justify-center text-red-400">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif-ballot">Confirm Single-Use Ballot Submission</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to seal and transmit your ballot? Once submitted, your elector key will be invalidated.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Review Ballot
              </button>
              <button
                onClick={handleConfirmBallot}
                className="w-1/2 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-700/30"
              >
                Confirm & Seal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Civic Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] py-6 text-center text-xs text-slate-500 font-mono">
        © 2026 CIVITAS ONLINE ELECTION COMMISSION. SUPABASE / POSTGRESQL ROW-LEVEL ENCRYPTED BALLOT LEDGER.
      </footer>
    </div>
  );
}
