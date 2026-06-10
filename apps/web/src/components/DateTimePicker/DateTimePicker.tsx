import c from './DateTimePicker.module.scss';

type DateTimePickerProps = {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => {
  return (
    <div className={c.dateTimeGroup}>
      <div className={c.field}>
        <label className={c.label}>Datum</label>
        <input
          type='date'
          className={c.dateInput}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className={c.field}>
        <label className={c.label}>Vrijeme</label>
        <input
          type='text'
          className={c.timeInput}
          value={time}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9:]*$/.test(val) && val.length <= 5) {
              onTimeChange(val);
            }
          }}
          placeholder='HH:MM'
          maxLength={5}
        />
      </div>
    </div>
  );
};
