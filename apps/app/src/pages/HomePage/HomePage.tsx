import { useState } from 'react';
import c from './HomePage.module.scss';
import {
  Button,
  EventCard,
  Filter,
  MatchCard,
  NoEventsCard,
  type FilterOption,
} from '@components/index';
import { Group } from '@components/index';
import { GroupDto, MatchDto, MatchTimerStateDto } from '@futsal-app/types';
import { getElapsedMinutes } from '@helpers/index';
import {
  EricssonLogo,
  OtpBankaLogo,
  EndavaLogo,
  InfobipLogo,
} from '@assets/index';

type Group = 'A' | 'B' | 'C' | 'D';
type Status = 'UPCOMING' | 'LIVE' | 'FINISHED';

const groupOptions: FilterOption<Group>[] = [
  { label: 'Skupina A', value: 'A' },
  { label: 'Skupina B', value: 'B' },
  { label: 'Skupina C', value: 'C' },
  { label: 'Skupina D', value: 'D' },
];

const statusOptions: FilterOption<Status>[] = [
  { label: 'Nadolazeće', value: 'UPCOMING' },
  { label: 'Uživo', value: 'LIVE' },
  { label: 'Završene', value: 'FINISHED' },
];

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

const reactLogoUrl =
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';

const mockGroup: GroupDto = {
  id: 1,
  name: 'Skupina A',
  tournamentId: 1,
  teams: [
    {
      id: 1,
      name: 'React United',
      logoUrl: reactLogoUrl,
      groupId: 1,
      tournamentId: 1,
      numberOfMatchesPlayed: 3,
      teamScore: 7,
      goalDifference: 5,
    },
    {
      id: 2,
      name: 'Hooks FC',
      logoUrl: reactLogoUrl,
      groupId: 1,
      tournamentId: 1,
      numberOfMatchesPlayed: 3,
      teamScore: 4,
      goalDifference: 1,
    },
    {
      id: 3,
      name: 'Fiber City',
      logoUrl: undefined,
      groupId: 1,
      tournamentId: 1,
      numberOfMatchesPlayed: 3,
      teamScore: 1,
      goalDifference: -60,
    },
  ],
};

export const HomePage = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  return (
    <div className={c.page}>
      <section className={c.section}>
        <div className={c.row}>
          <Button variant='primary'>Nova utakmica</Button>
          <Button variant='secondary'>Više</Button>
        </div>
        <div className={c.row}>
          <Filter
            label='Status'
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
          <Filter
            label='Skupina'
            value={group}
            options={groupOptions}
            onChange={setGroup}
          />
        </div>
      </section>

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

      <section className={c.section}>
        <Group group={mockGroup} />
      </section>

      <section className={c.section}>
        <div className={c.row}>
          <EventCard eventType='goal' playerName='Ivo Jovanović' minute={12} />
          <EventCard
            eventType='ownGoal'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='redCard'
            playerName='Ivo Jovanović'
            minute={12}
          />
          <EventCard
            eventType='yellowCard'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='penaltyGoal'
            playerName='Ivo Jovanović'
            minute={12}
          />
          <EventCard
            eventType='penaltyMiss'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='injury'
            playerName='Ivo Jovanović'
            minute={12}
          />
        </div>
      </section>

      <section className={c.section}>
        <div className={c.row}>
          <NoEventsCard />
        </div>
      </section>
    </div>
  );
};
