import c from './Button.module.css';
import {
  GrayPlus,
  GrayX,
  GrayTick,
  GrayClock,
  GreenPlus,
  GreenArrowRight,
  WhiteX,
  WhitePlus,
  WhiteTick,
  WhiteClock,
  BlackArrowRight,
  BlackPlus,
  BlackX,
  DarkgrayX,
} from '../../assets';
import { ButtonColor, ButtonIcon, IconColor } from '@futsal-app/types';

type ButtonProps = {
  children: React.ReactNode;
  color?: ButtonColor;
  hoverColor?: ButtonColor;
  icon?: ButtonIcon;
  iconColor?: IconColor;
  hoverIconColor?: IconColor;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const iconMap: Record<ButtonIcon, Record<IconColor, string>> = {
  [ButtonIcon.PLUS]: {
    [IconColor.GRAY]: GrayPlus,
    [IconColor.WHITE]: WhitePlus,
    [IconColor.GREEN]: GreenPlus,
    [IconColor.BLACK]: BlackPlus,
    [IconColor.DARK_GRAY]: BlackPlus,
  },
  [ButtonIcon.X]: {
    [IconColor.GRAY]: GrayX,
    [IconColor.WHITE]: WhiteX,
    [IconColor.GREEN]: GrayX,
    [IconColor.BLACK]: BlackX,
    [IconColor.DARK_GRAY]: DarkgrayX,
  },
  [ButtonIcon.ARROW]: {
    [IconColor.GRAY]: GrayPlus,
    [IconColor.WHITE]: BlackArrowRight,
    [IconColor.GREEN]: GreenArrowRight,
    [IconColor.BLACK]: BlackArrowRight,
    [IconColor.DARK_GRAY]: BlackArrowRight,
  },
  [ButtonIcon.TICK]: {
    [IconColor.GRAY]: GrayTick,
    [IconColor.WHITE]: WhiteTick,
    [IconColor.GREEN]: GrayTick,
    [IconColor.BLACK]: WhiteTick,
    [IconColor.DARK_GRAY]: WhiteTick,
  },
  [ButtonIcon.CLOCK]: {
    [IconColor.GRAY]: GrayClock,
    [IconColor.WHITE]: WhiteClock,
    [IconColor.GREEN]: GrayClock,
    [IconColor.BLACK]: WhiteClock,
    [IconColor.DARK_GRAY]: WhiteClock,
  },
};

const Button: React.FC<ButtonProps> = ({
  children,
  color = ButtonColor.WHITE,
  hoverColor = ButtonColor.GRAY,
  icon = ButtonIcon.PLUS,
  iconColor = IconColor.GRAY,
  hoverIconColor = IconColor.WHITE,
  className,
  ...props
}) => {
  const effectiveHoverColor = hoverColor ?? color;
  const effectiveHoverIconColor = hoverIconColor ?? iconColor;

  const defaultIcon = iconMap[icon][iconColor];
  const hoverIcon = iconMap[icon][effectiveHoverIconColor];

  const buttonClasses = [
    c.button,
    c[`bg-${color}`],
    c[`hover-bg-${effectiveHoverColor}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = [
    c.text,
    c[`text-${color}`],
    c[`hover-text-${effectiveHoverColor}`],
  ].join(' ');

  return (
    <button className={buttonClasses} {...props}>
      <span className={c.iconWrapper}>
        <img src={defaultIcon} alt='' className={c.iconDefault} />
        <img src={hoverIcon} alt='' className={c.iconHover} />
      </span>
      <span className={textClasses}>{children}</span>
    </button>
  );
};

export default Button;
