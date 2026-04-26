import { PlayerDto } from '@futsal-app/types';
import ButtonSmall from '@components/ButtonSmall/ButtonSmall';
import { PencilGray, TrashCanGray } from '@assets/icons';
import c from './PlayerList.module.scss';

type PlayerListProps = {
  players: PlayerDto[];
  onEdit: (player: PlayerDto) => void;
  onDelete: (player: PlayerDto) => void;
};

const PlayerList: React.FC<PlayerListProps> = ({ players, onEdit, onDelete }) => {
  if (players.length === 0) {
    return <span className={c.empty}>Još nema dodanih igrača</span>;
  }

  return (
    <div className={c.list}>
      {players.map((player, index) => (
        <div key={player.id} className={c.row}>
          <div className={c.info}>
            <span className={c.number}>{index + 1}</span>
            <span>{player.firstName} {player.lastName}</span>
          </div>
          <div className={c.actions}>
            <ButtonSmall
              iconSrc={PencilGray}
              hasBorder
              onClick={() => onEdit(player)}
            />
            <ButtonSmall
              iconSrc={TrashCanGray}
              hasBorder
              onClick={() => onDelete(player)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
