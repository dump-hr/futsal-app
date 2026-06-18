import c from './HomePage.module.scss';
import { Button, MatchCardLarge } from '@components/index';
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
    timeOfMatch: new Date(2024, 9, 21, 20, 30),
    homeGoals: 2,
    awayGoals: 2,
    matchType: 'quarterFinal',
    isActive: true,
    homeTeam: ericsson,
    awayTeam: otpBanka,
  },
  {
    id: 2,
    timeOfMatch: new Date(2024, 9, 21, 20, 30),
    homeGoals: 3,
    awayGoals: 1,
    matchType: 'quarterFinal',
    isActive: false,
    homeTeam: endava,
    awayTeam: infobip,
  },
  {
    id: 3,
    timeOfMatch: new Date(2099, 9, 21, 20, 30),
    homeGoals: 0,
    awayGoals: 0,
    matchType: 'quarterFinal',
    isActive: false,
    homeTeam: ericsson,
    awayTeam: otpBanka,
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
      <section className={c.section}>
        <div className={c.row}>
          <Button variant='primary'>Nova utakmica nova utakmica</Button>
          <Button variant='secondary'>Više</Button>
        </div>
      </section>
      <section className={c.cards}>
        {matches.map((match) => (
          <MatchCardLarge
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
