import { useState } from 'react';
import c from './HomePage.module.scss';
import { Button, Filter, type FilterOption } from '@components/index';

type Group = 'A' | 'B' | 'C' | 'D';
type Status = 'UPCOMING' | 'LIVE' | 'FINISHED';

const groupOptions: FilterOption<Group>[] = [
  { label: 'Skupina A', value: 'A' },
  { label: 'Skupina B', value: 'B' },
  { label: 'Skupina C', value: 'C' },
  { label: 'Skupina D', value: 'D' },
];

const statusOptions: FilterOption<Status>[] = [
  { label: 'Nadolazeće', value: 'UPCOMING' },
  { label: 'Uživo', value: 'LIVE' },
  { label: 'Završene', value: 'FINISHED' },
];

export const HomePage = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  return (
    <div className={c.page}>
      <section className={c.section}>
        <div className={c.row}>
          <Button variant='primary'>Nova utakmica nova utakmica</Button>
          <Button variant='secondary'>Više</Button>
        </div>
        <div className={c.row}>
          <Filter
            label='Status'
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
          <Filter
            label='Skupina'
            value={group}
            options={groupOptions}
            onChange={setGroup}
          />
        </div>
      </section>
    </div>
  );
};
