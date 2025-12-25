import { Select } from '@components/Select/Select';

export const HomePage = () => {
  return (
    <div style={{ backgroundColor: 'black' }}>
      <h1>Home Page</h1>
      <Select options={['Option 1', 'Option 2', 'Option 3']}></Select>
    </div>
  );
};
