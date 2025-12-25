import c from './select.module.css';

export const Select = ({ options }: { options: string[] }) => {
  return (
    <select className={c.select}>
      {options.map((option) => (
        <option key={option} value={option} className={c.option}>
          {option}
        </option>
      ))}
    </select>
  );
};
