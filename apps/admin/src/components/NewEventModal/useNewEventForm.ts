import { useState } from 'react';
import toast from 'react-hot-toast';
import { EventType, type MatchDto } from '@futsal-app/types';
import { useMatchEventCreate } from '@api/index';
import { EVENT_LABELS } from '@types';
import { REGULATION_EVENT_TYPES, SHOOTOUT_EVENT_TYPES } from './constants';

export type TeamSide = 'home' | 'away';

type UseNewEventFormArgs = {
  match: MatchDto;
  mode: 'regulation' | 'shootout';
  currentMinute: number;
  presetEventType?: EventType;
  onClose: () => void;
};

export const useNewEventForm = ({
  match,
  mode,
  currentMinute,
  presetEventType,
  onClose,
}: UseNewEventFormArgs) => {
  const [teamSide, setTeamSide] = useState<TeamSide | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(
    presetEventType ?? null,
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const isShootout = mode === 'shootout';
  const homePlayers = match.homeTeam?.players ?? [];
  const awayPlayers = match.awayTeam?.players ?? [];

  const { mutate: createEvent, isPending } = useMatchEventCreate(match.id, {
    onSuccess: onClose,
  });

  const teamOptions: { label: string; value: TeamSide }[] = [
    { label: match.homeTeam?.name ?? 'Domaća ekipa', value: 'home' },
    { label: match.awayTeam?.name ?? 'Gostujuća ekipa', value: 'away' },
  ];

  const eventTypes = isShootout ? SHOOTOUT_EVENT_TYPES : REGULATION_EVENT_TYPES;
  const eventTypeOptions = eventTypes.map((value) => ({
    label: EVENT_LABELS[value],
    value,
  }));

  const playerPool =
    teamSide === 'home'
      ? homePlayers
      : teamSide === 'away'
        ? awayPlayers
        : [...homePlayers, ...awayPlayers];

  const title = isShootout ? 'Novi penal' : 'Novi događaj';
  const subtitle = isShootout
    ? 'Unesi izvođača kaznenog udarca'
    : 'Odaberi ekipu, događaj i igrača';

  const changeTeam = (side: TeamSide): boolean => {
    setTeamSide(side);
    if (selectedPlayerId == null) return false;
    const sourcePool = side === 'home' ? homePlayers : awayPlayers;
    if (sourcePool.some((p) => p.id === selectedPlayerId)) return false;
    setSelectedPlayerId(null);
    return true;
  };

  const submit = () => {
    if (!eventType) {
      toast.error('Odaberi događaj');
      return;
    }
    if (!teamSide) {
      toast.error('Odaberi ekipu');
      return;
    }

    createEvent({
      minute: isShootout ? 0 : currentMinute,
      matchId: match.id,
      playerId: selectedPlayerId,
      eventType,
      isForHomeTeam: teamSide === 'home',
    });
  };

  return {
    teamSide,
    setTeamSide,
    eventType,
    setEventType,
    selectedPlayerId,
    setSelectedPlayerId,
    isShootout,
    isPending,
    homePlayers,
    playerPool,
    teamOptions,
    eventTypeOptions,
    title,
    subtitle,
    changeTeam,
    submit,
  };
};
