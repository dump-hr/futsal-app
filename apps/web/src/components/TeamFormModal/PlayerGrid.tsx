import { ButtonSmall, Input } from '@components/index';
import { PlusBlack } from '@assets/icons';
import { BackgroundColor } from '@types';
import c from './TeamFormModal.module.scss';

export type PlayerEntry = {
  id?: number;
  firstName: string;
  lastName: string;
};

type PlayerGridProps = {
  players: PlayerEntry[];
  onEditPlayer: (index: number) => void;
  onAddPlayer: () => void;
};

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  onEditPlayer,
  onAddPlayer,
}) => {
  return (
    <div className={c.playerList}>
      {players.map((player, i) => (
        <div
          key={player.id ?? `new-${i}`}
          className={c.playerRow}
          onClick={() => onEditPlayer(i)}>
          <span className={c.playerLabel}>Igrač #{i + 1}</span>
          <Input value={`${player.firstName} ${player.lastName}`} readOnly />
        </div>
      ))}
      <div className={c.playerRow}>
        <span className={c.playerLabel}>Igrač #{players.length + 1}</span>
        <div className={c.newPlayerRow}>
          <div className={c.newPlayerInput}>
            <Input
              value=''
              readOnly
              placeholder='Ime i prezime'
              onClick={onAddPlayer}
            />
          </div>
          <ButtonSmall
            backgroundColor={BackgroundColor.White}
            iconSrc={PlusBlack}
            onClick={onAddPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerGrid;
