import matchEndSound from '@assets/sounds/match-ending.mp3';

export const playMatchEndSound = () => {
  new Audio(matchEndSound).play().catch(() => {});
};
