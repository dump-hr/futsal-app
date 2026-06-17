import { TeamDto } from '@futsal-app/types';
import { TeamInfo } from '@components/index';
import c from './TeamsTable.module.scss';

type TeamsTableProps = {
  teams: TeamDto[];
  onDelete: (team: { id: number; name: string }) => void;
  onEdit: (teamId: number) => void;
  onRowClick: (teamId: number) => void;
};

export const TeamsTable: React.FC<TeamsTableProps> = ({ teams, onDelete, onEdit, onRowClick }) => {
  return (
    <div className={c.teamListSection}>
      <div className={c.columnHeaders}>
        <span>Naziv</span>
        <div className={c.columnStats}>
          <span className={c.colHeader}>Broj bodova</span>
          <span className={c.colHeader}>Skupina</span>
          <span className={c.colHeader}>Broj igrača</span>
          <span className={c.colHeader}>Broj utakmica</span>
        </div>
      </div>

      <div className={c.teamList}>
        {teams.map((team) => (
          <TeamInfo
            key={team.id}
            teamName={team.name}
            teamLogoUrl={team.logoUrl ?? ''}
            teamScore={team.teamScore ?? 0}
            teamGroup={team.group?.name ?? '-'}
            numberOfPlayers={team.numberOfPlayers ?? 0}
            numberOfMatchesPlayed={team.numberOfMatchesPlayed ?? 0}
            onDelete={() => onDelete({ id: team.id, name: team.name })}
            onEdit={() => onEdit(team.id)}
            onClick={() => onRowClick(team.id)}
          />
        ))}
      </div>
    </div>
  );
};
