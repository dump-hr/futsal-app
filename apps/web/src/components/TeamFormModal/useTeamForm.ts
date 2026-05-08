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
import { useGroupsGet } from '@api/group';
import { PlayerModalAdd, PlayerModalEditByIndex } from '@types';
import { GroupOption } from '@constants/groupOptions';
import type { PlayerEntry } from './PlayerGrid';

//TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

export type PlayerModal = PlayerModalAdd | PlayerModalEditByIndex;

type UseTeamFormArgs = {
  teamId?: number;
  onClose: () => void;
};

export const useTeamForm = ({ teamId, onClose }: UseTeamFormArgs) => {
  const [teamName, setTeamName] = useState('');
  const [group, setGroup] = useState<GroupOption>('none');
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [playerModal, setPlayerModal] = useState<PlayerModal | null>(null);
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
  const { data: groups } = useGroupsGet();

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

  const handlePlayerSave = (firstName: string, lastName: string) => {
    if (playerModal?.type === 'add') {
      setPlayers([...players, { firstName, lastName }]);
    } else if (playerModal?.type === 'edit') {
      const updated = [...players];
      updated[playerModal.index] = {
        ...updated[playerModal.index],
        firstName,
        lastName,
      };
      setPlayers(updated);
    }
    setPlayerModal(null);
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

    try {
      const team = await saveTeam();
      await syncPlayers({
        teamId: team.id,
        dto: {
          players: players.map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
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
    playerModal,
    setPlayerModal,
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
    handlePlayerSave,
    handleSave,
  };
};
