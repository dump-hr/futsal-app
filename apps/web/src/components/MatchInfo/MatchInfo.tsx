import React from 'react';
import c from './MatchInfo.module.scss';
import playIconSvg from '../../assets/icons/play-black.svg';
import trachCanIconSvg from '../../assets/icons/trash-can-gray.svg';
import editIconSvg from '../../assets/icons/pencil-gray.svg';
import doneIconSvg from '../../assets/icons/check-black.svg';
import timerIconSvg from '../../assets/icons/timer-gray.svg';

export const MatchStage = {
  GROUP_STAGE: 'Grupa',
  QUARTER_FINALS: 'Četvrtfinale',
  SEMI_FINALS: 'Polufinale',
  FINAL: 'Finale',
} as const;

export const MatchStatus = {
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
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
  console.log('MatchActions render with status:', status);
  switch (status) {
    case MatchStatus.UPCOMING:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton
            iconUrl={playIconSvg}
            altStyle='iconButtonPlay'
            altText='Play'
          />
          <IconButton iconUrl={trachCanIconSvg} altText='Delete' />
          <IconButton iconUrl={editIconSvg} altText='Edit' />
        </div>
      );
    case MatchStatus.LIVE:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton iconUrl={timerIconSvg} altText='Stopwatch' />
          <div className={c.redDotIndicator}>
            <div className={c.redDotIndicatorInner} />
          </div>
        </div>
      );
    case MatchStatus.FINISHED:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton
            iconUrl={doneIconSvg}
            altStyle='iconButtonDone'
            altText='Done'
          />
          <IconButton iconUrl={trachCanIconSvg} altText='Delete' />
          <IconButton iconUrl={editIconSvg} altText='Edit' />
        </div>
      );
    default:
      return null;
  }
};

type IconButtonProps = {
  iconUrl: string;
  altText: string;
  altStyle?: string;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  iconUrl,
  altText,
  altStyle = '',
  onClick,
}) => {
  return (
    <button className={c.iconButtonWrapper} onClick={onClick}>
      <img
        src={iconUrl}
        alt={altText}
        className={`${c.iconButtonImage} ${c[altStyle]}`}
      />
    </button>
  );
};
