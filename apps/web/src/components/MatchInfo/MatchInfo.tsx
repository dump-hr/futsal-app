import React from 'react';
import c from './MatchInfo.module.scss';

export const MatchStage = {
  GROUP_STAGE: 'Grupa',
  QUARTER_FINALS: 'Četvrtfinale',
  SEMI_FINALS: 'Polufinale',
  FINAL: 'Finale',
} as const;

export const MatchStatus = {
  UPCOMING: '',
  LIVE: '',
  FINISHED: '',
} as const;

type MatchStage = (typeof MatchStage)[keyof typeof MatchStage];
type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

interface TeamInfo {
  teamName: string;
  logoUrl: string;
  score?: number;
}

type MatchInfoProps = {
  teamA: TeamInfo;
  teamB: TeamInfo;
  teamAScore?: number;
  teamBScore?: number;
  matchTime: string;
  matchStage: MatchStage;
  matchStatus: MatchStatus;
};

export const MatchInfo: React.FC<MatchInfoProps> = ({
  teamA,
  teamB,
  teamAScore,
  teamBScore,
  matchTime,
  matchStage,
  matchStatus,
}) => {
  return (
    <div className={c.card}>
      <StageBadge matchStage={matchStage} />
      <div className={c.content}>
        <TeamInfo team={teamA} align='left' />
        <ScorePill
          teamAScore={teamAScore}
          teamBScore={teamBScore}
          isUpcoming={matchStatus === MatchStatus.UPCOMING}
        />
        <TeamInfo team={teamB} align='right' />

        <div className={c.matchTime}>{matchTime}</div>

        <MatchActions status={matchStatus} />
      </div>
    </div>
  );
};

type StagePillProps = {
  matchStage: MatchStage;
};

const StageBadge: React.FC<StagePillProps> = ({ matchStage }) => {
  return <div className={c.stagePill}>{matchStage}</div>;
};

type TeamInfoProps = {
  team: TeamInfo;
  align: 'left' | 'right';
};

const TeamInfo: React.FC<TeamInfoProps> = ({ team, align }) => {
  return (
    <div className={`${c.team} ${c[align]}`}>
      <span className={c.teamName}>{team.teamName}</span>
      <img src={team.logoUrl} className={c.teamLogo} alt={team.teamName} />
    </div>
  );
};

type ScorePillProps = {
  teamAScore?: number;
  teamBScore?: number;
  isUpcoming: boolean;
};

const ScorePill: React.FC<ScorePillProps> = ({
  teamAScore,
  teamBScore,
  isUpcoming,
}) => {
  return (
    <div className={c.scorePill}>
      {isUpcoming ? 'VS' : `${teamAScore} : ${teamBScore}`}
    </div>
  );
};

type MatchActionsProps = {
  status: MatchStatus;
};

const MatchActions: React.FC<MatchActionsProps> = ({ status }) => {
  switch (status) {
    case MatchStatus.UPCOMING:
      return (
        <div className={c.matchActionWrapper}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    case MatchStatus.LIVE:
      return (
        <div className={c.matchActionWrapper}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    case MatchStatus.FINISHED:
      return (
        <div className={c.matchActionWrapper}>
          <div></div>
          <div></div>
        </div>
      );
    default:
      return null;
  }
};

type IconButtonProps = {
  iconUrl: string;
  altText: string;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  iconUrl,
  altText,
  onClick,
}) => {
  return (
    <button className={c.iconButtonWrapper} onClick={onClick}>
      <img src={iconUrl} alt={altText} className={c.iconButton} />
    </button>
  );
};
