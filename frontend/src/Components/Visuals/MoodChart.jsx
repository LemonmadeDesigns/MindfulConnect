import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card } from '../ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const moodEntry = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border">
        <p className="text-sm font-medium">{new Date(label).toLocaleDateString()}</p>
        <p className="text-sm">Mood Score: {moodEntry.moodScore}</p>
        <p className="text-sm">Feeling: {moodEntry.dominantEmotion}</p>
        <p className="text-sm">Activities: {moodEntry.activities.join(', ')}</p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string
};

const MoodChart = ({ moodData = [] }) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Weekly Mood Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodScore"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Mood Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

MoodChart.propTypes = {
  moodData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      moodScore: PropTypes.number.isRequired,
      dominantEmotion: PropTypes.string,
      activities: PropTypes.arrayOf(PropTypes.string)
    })
  )
};

export default MoodChart;