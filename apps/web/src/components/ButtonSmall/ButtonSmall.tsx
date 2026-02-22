import clsx from 'clsx';
import c from './ButtonSmall.module.scss';
import { BackgroundColor } from '../../types';

type ButtonSmallProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  iconSrc: string;
  backgroundColor?: BackgroundColor;
  width?: number;
  hasBorder?: boolean;
};

const ButtonSmall: React.FC<ButtonSmallProps> = ({
  iconSrc,
  backgroundColor = BackgroundColor.Transparent,
  width = 40,
  hasBorder = false,
}) => {
  return (
    <button
      style={{ width, height: width, backgroundColor }}
      className={clsx(c.buttonContainer, {
        [c.grayMediumBorder]: hasBorder,
      })}>
      <img src={iconSrc} className={c.buttonIcon} />
    </button>
  );
};
export default ButtonSmall;
