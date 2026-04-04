import c from './MatchFormModal.module.scss';

type DateTimePickerProps = {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
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
          type='time'
          className={c.timeInput}
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
