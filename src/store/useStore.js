import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeRole: 'voter', // 'voter' | 'commissioner'

  currentVoter: {
    voterId: 'VT-882109-USA',
    name: 'Alexander Vance',
    jurisdiction: 'Precinct 04 — Metropolitan District',
    isVerified: true,
    hasVoted: false,
    ballotReceiptHash: null
  },

  electionState: {
    title: '2026 Metropolitan Civic Infrastructure & Leadership Referendum',
    status: 'POLLS_OPEN', // 'POLLS_OPEN' | 'POLLS_CLOSED'
    closeTime: '2026-11-04 20:00 EST',
    totalRegisteredVoters: 14500,
    turnoutCount: 9420,
    turnoutRate: '64.9%'
  },

  proposals: [
    {
      id: 'prop-1',
      type: 'Executive Council Leader',
      title: 'Office of the Metropolitan Executive Magistrate',
      description: 'Choose one candidate for the 4-year municipal administrative term.',
      candidates: [
        {
          id: 'cand-1',
          name: 'Hon. Elena Rostova',
          party: 'Civic Renewal & Green Infrastructure',
          votes: 4820,
          manifesto: 'Decarbonize municipal transit by 2028, modernize public fiber broadband, and expand zero-emissions commuter light rail.'
        },
        {
          id: 'cand-2',
          name: 'Dr. Marcus Brody',
          party: 'Fiscal Accountability & Innovation Alliance',
          votes: 4600,
          manifesto: 'Municipal budget optimization, public-private research incubators, and sovereign digital identity safeguards.'
        }
      ]
    },
    {
      id: 'prop-2',
      type: 'Ballot Measure',
      title: 'Proposition 14: Clean Desalination & Solar Microgrid Bond',
      description: 'Authorize $250M in municipal general-obligation bonds for coastal reservoir solar desalination.',
      candidates: [
        { id: 'opt-yes', name: 'YES — Authorize Clean Water Bond', party: 'Measure Initiative', votes: 6100, manifesto: 'Fund deep-water intake facilities and emergency freshwater security.' },
        { id: 'opt-no', name: 'NO — Reject Bond Measure', party: 'Measure Initiative', votes: 3320, manifesto: 'Prioritize existing water infrastructure repair before issuing new debt.' }
      ]
    }
  ],

  auditTrail: [
    { id: 'block-9419', timestamp: '2026-09-27 14:15:22 UTC', hash: '0x8f2a...91bc', prevHash: '0x3c19...44fa', status: 'Sealed & Validated' },
    { id: 'block-9420', timestamp: '2026-09-27 14:16:04 UTC', hash: '0x7e44...aa81', prevHash: '0x8f2a...91bc', status: 'Sealed & Validated' }
  ],

  // Actions
  setActiveRole: (role) => set({ activeRole: role }),

  castBallot: (votesObj) => set((state) => {
    if (state.currentVoter.hasVoted) return {};

    const receiptHash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    // Increment votes
    const updatedProposals = state.proposals.map((prop) => {
      const selectedCandId = votesObj[prop.id];
      return {
        ...prop,
        candidates: prop.candidates.map((c) =>
          c.id === selectedCandId ? { ...c, votes: c.votes + 1 } : c
        )
      };
    });

    const newBlock = {
      id: `block-${state.electionState.turnoutCount + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      hash: receiptHash,
      prevHash: state.auditTrail[state.auditTrail.length - 1]?.hash || '0x000...genesis',
      status: 'Sealed & Cryptographically Signed'
    };

    return {
      currentVoter: {
        ...state.currentVoter,
        hasVoted: true,
        ballotReceiptHash: receiptHash
      },
      proposals: updatedProposals,
      electionState: {
        ...state.electionState,
        turnoutCount: state.electionState.turnoutCount + 1,
        turnoutRate: `${(((state.electionState.turnoutCount + 1) / state.electionState.totalRegisteredVoters) * 100).toFixed(1)}%`
      },
      auditTrail: [...state.auditTrail, newBlock]
    };
  }),

  togglePolls: () => set((state) => ({
    electionState: {
      ...state.electionState,
      status: state.electionState.status === 'POLLS_OPEN' ? 'POLLS_CLOSED' : 'POLLS_OPEN'
    }
  }))
}));
