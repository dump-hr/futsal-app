import c from './TeamInfo.module.scss';

type TeamInfoProps = {
  teamName: string;
  teamLogoUrl: string;
  teamScore: number;
  teamGroup: string;
  numberOfPlayers: number;
  numberOfMatchesPlayed: number;
};

export const TeamInfo: React.FC<TeamInfoProps> = ({
  teamName,
  teamLogoUrl,
  teamScore,
  teamGroup,
  numberOfPlayers,
  numberOfMatchesPlayed,
}) => {
  return (
    <div className={c.team}>
      <div className={c.teamInfo}>
        <img src={teamLogoUrl} alt={teamName} className={c.teamLogo} />
        <span className={c.teamName}>{teamName}</span>
      </div>
      <div className={c.teamStatsWrapper}>
        <div className={c.teamStats}>
          <span>{teamScore}</span>
          <span>Skupina {teamGroup}</span>
          <span>{numberOfPlayers} igrača</span>
          <span>{numberOfMatchesPlayed} utakmice</span>
        </div>
        <div className={c.teamActions}></div>
      </div>
    </div>
  );
};
