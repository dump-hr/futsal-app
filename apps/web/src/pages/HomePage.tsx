import { Select } from '@components/Select/Select';

export const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Select options={['Option 1', 'Option 2', 'Option 3']}></Select>
    </div>
  );
};
