import c from './HomePage.module.scss';
import { MatchCard } from '@components/index';
import { MatchDto, MatchTimerStateDto } from '@futsal-app/types';
import { getElapsedMinutes } from '@helpers/index';
import {
  EricssonLogo,
  OtpBankaLogo,
  EndavaLogo,
  InfobipLogo,
} from '@assets/index';

const groupA = { id: 1, name: 'A', tournamentId: 1 };

const ericsson = {
  id: 1,
  name: 'Ericsson Nikola Tesla',
  logoUrl: EricssonLogo,
  group: groupA,
};
const otpBanka = {
  id: 2,
  name: 'OTP banka',
  logoUrl: OtpBankaLogo,
  group: groupA,
};
const endava = { id: 3, name: 'Endava', logoUrl: EndavaLogo, group: groupA };
const infobip = { id: 4, name: 'Infobip', logoUrl: InfobipLogo, group: groupA };

// Mock data — replace with matches from `GET /api/match?tournamentId={id}`
// (e.g. a `useMatches()` React Query hook returning `MatchDto[]`).
const matches: MatchDto[] = [
  {
    id: 1,
    timeOfMatch: new Date(2024, 9, 11, 20, 30),
    homeGoals: 0,
    awayGoals: 0,
    matchType: 'group',
    isActive: true,
    homeTeam: ericsson,
    awayTeam: otpBanka,
  },
  {
    id: 2,
    timeOfMatch: new Date(2024, 9, 11, 20, 30),
    homeGoals: 1,
    awayGoals: 0,
    matchType: 'group',
    isActive: false,
    homeTeam: ericsson,
    awayTeam: otpBanka,
  },
  {
    id: 3,
    timeOfMatch: new Date(2099, 9, 11, 21, 0),
    homeGoals: 0,
    awayGoals: 0,
    matchType: 'group',
    isActive: false,
    homeTeam: endava,
    awayTeam: infobip,
  },
];

// Mock timer for the active match — replace with its live timer from the SSE stream
// `GET /api/match/:id/timer/stream` (e.g. a `useMatchTimerLive(matchId)` hook → `MatchTimerStateDto`).
const liveTimer: MatchTimerStateDto = {
  matchId: 1,
  isRunning: false,
  accumulatedMs: 12 * 60 * 1000,
  startedAt: null,
  lastSyncedAt: null,
};

export const HomePage = () => {
  return (
    <div className={c.page}>
      <section className={c.list}>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            elapsedMinutes={
              match.isActive ? getElapsedMinutes(liveTimer) : undefined
            }
          />
        ))}
      </section>
    </div>
  );
};
