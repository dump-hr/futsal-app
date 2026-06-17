import clsx from 'clsx';
import { MATCH_STAGE, MATCH_STAGE_LABEL } from './constants';
import type { MatchStage } from './types';
import c from './MatchInfo.module.scss';

type StageBadgeProps = {
  matchStage: MatchStage;
};

const STAGE_COLOR_CLASS: Record<MatchStage, string> = {
  [MATCH_STAGE.GROUP_STAGE]: c.stageGroup,
  [MATCH_STAGE.QUARTER_FINALS]: c.stageQuarter,
  [MATCH_STAGE.SEMI_FINALS]: c.stageSemi,
  [MATCH_STAGE.FINAL]: c.stageFinal,
};

export const StageBadge: React.FC<StageBadgeProps> = ({ matchStage }) => {
  return (
    <div className={clsx(c.stageBadge, STAGE_COLOR_CLASS[matchStage])}>
      {MATCH_STAGE_LABEL[matchStage]}
    </div>
  );
};
