import { useEffect, useState } from 'react';
import axios from 'axios';

interface RallyData {
  name: string;
  href: string;
  description: string;
  players_total: number;
  players_finished: number;
  stages_count: number;
  legs_count: number;
  creator: string;
  damage_model: string;
  schedule: {
    start: string | null;
    end: string | null;
  };
}

function App() {
  const [rallyData, setRallyData] = useState<RallyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App mounted');
    const fetchData = async () => {
      console.log('Fetching rally data...');
      try {
        const response = await axios.get('https://api.rafaelbastiani.com/api/online/rally-table');
        console.log(response.data);
        setRallyData(response.data);
      } catch (err) {
        setError('Failed to load rally data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    console.log('App mounted');

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading rally data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl font-bold mb-6">Rally Events</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Players</th>
              <th className="px-6 py-3">Finished</th>
              <th className="px-6 py-3">Stages</th>
              <th className="px-6 py-3">Legs</th>
              <th className="px-6 py-3">Creator</th>
              <th className="px-6 py-3">Damage Model</th>
              <th className="px-6 py-3">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {rallyData.map((rally, index) => (
              <tr 
                key={index} 
                className="border-b bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  <a href={rally.href} target="_blank" rel="noopener noreferrer">{rally.name}</a>
                </td>
                <td className="px-6 py-4">{rally.description}</td>
                <td className="px-6 py-4">{rally.players_total}</td>
                <td className="px-6 py-4">{rally.players_finished}</td>
                <td className="px-6 py-4">{rally.stages_count}</td>
                <td className="px-6 py-4">{rally.legs_count}</td>
                <td className="px-6 py-4">{rally.creator}</td>
                <td className="px-6 py-4">{rally.damage_model}</td>
                <td className="px-6 py-4">
                  {rally.schedule.start || 'Not started'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
