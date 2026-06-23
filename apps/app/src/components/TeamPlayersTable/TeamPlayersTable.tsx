import clsx from 'clsx';
import { PlayerDto } from '@futsal-app/types';
import { GoalLime } from '@assets/index';
import c from './TeamPlayersTable.module.scss';

type TeamPlayersTableProps = {
  players: PlayerDto[];
};

export const TeamPlayersTable: React.FC<TeamPlayersTableProps> = ({
  players,
}) => {
  const sortedPlayers = [...players].sort(
    (a, b) =>
      (b.goals ?? 0) - (a.goals ?? 0) || a.lastName.localeCompare(b.lastName),
  );

  return (
    <div className={c.table}>
      <div className={clsx(c.row, c.headerRow)}>
        <span className={c.headerLabel}>Ime i Prezime</span>
        <img className={c.goalIcon} src={GoalLime} alt='Golovi' />
      </div>

      {sortedPlayers.map((player) => (
        <div key={player.id} className={c.row}>
          <span className={c.playerName}>
            {player.firstName} {player.lastName}
          </span>
          <span className={c.goals}>{player.goals ?? 0}</span>
        </div>
      ))}
    </div>
  );
};
