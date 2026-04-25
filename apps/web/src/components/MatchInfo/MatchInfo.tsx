import React from 'react';
import c from './MatchInfo.module.scss';
import { StageBadge } from './StageBadge';
import { TeamSummary } from './TeamSummary';
import { ScorePill } from './ScorePill';
import { MatchActions } from './MatchActions';
import {
  type MatchStatus,
  type MatchStage,
  type TeamInfo,
  MATCH_STATUS,
} from '.';

type MatchInfoProps = {
  teamA: TeamInfo;
  teamB: TeamInfo;
  teamAScore?: number;
  teamBScore?: number;
  matchTime: string;
  matchStage: MatchStage;
  matchStatus: MatchStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
};

export const MatchInfo: React.FC<MatchInfoProps> = ({
  teamA,
  teamB,
  teamAScore,
  teamBScore,
  matchTime,
  matchStage,
  matchStatus,
  onEdit,
  onDelete,
  onActivate,
}) => {
  return (
    <div className={c.card}>
      <StageBadge matchStage={matchStage} />
      <div className={c.content}>
        <TeamSummary team={teamA} align='left' />
        <ScorePill
          teamAScore={teamAScore}
          teamBScore={teamBScore}
          isUpcoming={matchStatus === MATCH_STATUS.UPCOMING}
        />
        <TeamSummary team={teamB} align='right' />

        <div className={c.matchTime}>{matchTime}</div>

        <MatchActions
          status={matchStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
        />
      </div>
    </div>
  );
};
