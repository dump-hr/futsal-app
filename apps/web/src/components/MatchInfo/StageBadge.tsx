import { MATCH_STAGE_LABEL, type MatchStage } from '.';
import c from './MatchInfo.module.scss';

type StageBadgeProps = {
  matchStage: MatchStage;
};

export const StageBadge: React.FC<StageBadgeProps> = ({ matchStage }) => {
  return <div className={c.stageBadge}>{MATCH_STAGE_LABEL[matchStage]}</div>;
};
