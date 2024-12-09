// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
// import { Card } from './../ui/Card';

// const EmotionPatterns = () => {
//   // Sample data for the emotion patterns
//   const data = [
//     { name: 'Peaceful', value: 20, color: '#93C5FD' },  // blue-300
//     { name: 'Sad', value: 15, color: '#86EFAC' },      // green-300
//     { name: 'Excited', value: 15, color: '#FCD34D' },  // yellow-300
//     { name: 'Tired', value: 15, color: '#FCA5A5' },    // red-300
//     { name: 'Angry', value: 15, color: '#C4B5FD' },    // purple-300
//     { name: 'Confident', value: 20, color: '#F9A8D4' }  // pink-300
//   ];

//   return (
//     <Card className="p-6">
//       <h3 className="text-lg font-medium mb-4">Emotion Patterns</h3>
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={2}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Legend 
//               layout="vertical" 
//               align="right"
//               verticalAlign="middle"
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </Card>
//   );
// };

// export default EmotionPatterns;



import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PropTypes from 'prop-types';
import { Card } from '../ui/Card';

const EmotionPatterns = ({ moodData }) => {
  // Calculate emotion frequencies
  const getEmotionFrequency = () => {
    const emotionCounts = moodData.reduce((acc, entry) => {
      entry.emotions.forEach(emotion => {
        acc[emotion] = (acc[emotion] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(emotionCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const COLORS = {
    // Positive emotions
    Happy: '#4CAF50',
    Excited: '#8BC34A',
    Peaceful: '#2196F3',
    Grateful: '#03A9F4',
    Confident: '#00BCD4',
    Energetic: '#009688',

    // Challenging emotions
    Anxious: '#FF5722',
    Sad: '#F44336',
    Stressed: '#E91E63',
    Angry: '#9C27B0',
    Tired: '#673AB7',
    Overwhelmed: '#795548'
  };

  const data = getEmotionFrequency();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Emotion Patterns</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name] || '#000000'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`Count: ${value}`, name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

EmotionPatterns.propTypes = {
  moodData: PropTypes.arrayOf(
    PropTypes.shape({
      emotions: PropTypes.arrayOf(PropTypes.string).isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default EmotionPatterns;