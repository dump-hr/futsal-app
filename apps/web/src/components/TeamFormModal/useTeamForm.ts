import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TeamDto } from '@futsal-app/types';
import {
  useTeamGet,
  useTeamCreate,
  useTeamUpdate,
  useTeamPlayersSync,
  useTeamUploadLogo,
  useTeamDeleteLogo,
} from '@api/team';
import { useGroupsGetByTournamentId } from '@api/group';
import { GroupOption } from '@constants/groupOptions';
import { getPlayerNameValidationError } from '@helpers/validatePlayerName';
import type { PlayerEntry } from './PlayerGrid';

//TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

type UseTeamFormArgs = {
  teamId?: number;
  onClose: () => void;
};

export const useTeamForm = ({ teamId, onClose }: UseTeamFormArgs) => {
  const [teamName, setTeamName] = useState('');
  const [group, setGroup] = useState<GroupOption>('none');
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const teamNameError = submitAttempted && !teamName.trim();

  const { data: existingTeam } = useTeamGet(teamId);
  const { mutateAsync: createTeam, isPending: isCreating } = useTeamCreate();
  const { mutateAsync: updateTeam, isPending: isUpdating } = useTeamUpdate();
  const { mutateAsync: syncPlayers, isPending: isSyncingPlayers } =
    useTeamPlayersSync();
  const { mutateAsync: uploadLogo, isPending: isUploadingLogo } =
    useTeamUploadLogo();
  const { mutateAsync: deleteLogo, isPending: isDeletingLogo } =
    useTeamDeleteLogo();
  const { data: groups } = useGroupsGetByTournamentId(TOURNAMENT_ID);

  const isSaving =
    isCreating ||
    isUpdating ||
    isSyncingPlayers ||
    isUploadingLogo ||
    isDeletingLogo;

  const isEdit = teamId !== undefined;
  const ready = !isEdit || !!existingTeam;

  const groupOptions: { label: string; value: GroupOption }[] = [
    { label: 'Bez skupine', value: 'none' },
    ...(groups ?? []).map((g) => ({
      label: `Skupina ${g.name}`,
      value: String(g.id),
    })),
  ];

  useEffect(() => {
    if (existingTeam && isEdit && !initialized) {
      setTeamName(existingTeam.name);
      setGroup(existingTeam.groupId ? String(existingTeam.groupId) : 'none');

      const existingPlayers: PlayerEntry[] = (existingTeam.players ?? []).map(
        (p: PlayerEntry) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
        }),
      );

      setPlayers(existingPlayers);
      setInitialized(true);
    }
  }, [existingTeam, isEdit, initialized]);

  const handleLogoChange = (file: File | null) => {
    setPendingLogo(file);
    setRemoveLogo(file === null && !!existingTeam?.logoUrl);
  };

  const updatePlayer = (index: number, patch: Partial<PlayerEntry>) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  };

  const addPlayer = (player: { firstName: string; lastName: string }) => {
    setPlayers((prev) => [...prev, player]);
  };

  const requestDeletePlayer = (index: number) => setPendingDeleteIndex(index);
  const cancelDeletePlayer = () => setPendingDeleteIndex(null);
  const confirmDeletePlayer = () => {
    if (pendingDeleteIndex === null) return;
    setPlayers((prev) => prev.filter((_, i) => i !== pendingDeleteIndex));
    setPendingDeleteIndex(null);
  };

  const saveTeam = async (): Promise<TeamDto> => {
    if (isEdit) {
      return updateTeam({
        id: teamId,
        dto: {
          name: teamName,
          groupId: group === 'none' ? null : Number(group),
        },
      });
    }
    return createTeam({
      name: teamName,
      groupId: group === 'none' ? undefined : Number(group),
      tournamentId: TOURNAMENT_ID,
    });
  };

  const syncTeamLogo = async (targetTeamId: number) => {
    if (pendingLogo) {
      await uploadLogo({ teamId: targetTeamId, file: pendingLogo });
    } else if (removeLogo) {
      await deleteLogo(targetTeamId);
    }
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      setSubmitAttempted(true);
      toast.error('Unesite ime ekipe');
      return;
    }

    for (let i = 0; i < players.length; i++) {
      const fn = players[i].firstName.trim();
      const ln = players[i].lastName.trim();
      const err = getPlayerNameValidationError(fn, ln);
      if (err) {
        toast.error(`Igrač #${i + 1}: ${err}`);
        return;
      }
    }

    try {
      const team = await saveTeam();
      await syncPlayers({
        teamId: team.id,
        dto: {
          players: players.map(({ id, firstName, lastName }) => ({
            id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          })),
        },
      });
      await syncTeamLogo(team.id);
      onClose();
    } catch (error) {
      console.error('Failed to save team:', error);
    }
  };

  return {
    teamName,
    setTeamName,
    group,
    setGroup,
    players,
    pendingDeleteIndex,
    pendingLogo,
    removeLogo,
    existingTeam,
    groupOptions,
    isEdit,
    ready,
    initialized,
    isSaving,
    teamNameError,
    handleLogoChange,
    updatePlayer,
    addPlayer,
    requestDeletePlayer,
    cancelDeletePlayer,
    confirmDeletePlayer,
    handleSave,
  };
};
