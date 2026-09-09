import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
  showAll?: boolean;
}

export default function RegionFilter({ value, onChange, showAll = true }: RegionFilterProps) {
  const { data } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await api.get('/financial/regions');
      return res.data.data;
    },
  });

  const regions = data || [];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select-field"
    >
      {showAll && <option value="">All Regions</option>}
      {regions.map((region: any) => (
        <option key={region.id || region.code} value={region.code}>
          {region.name} ({region.code})
        </option>
      ))}
    </select>
  );
}
