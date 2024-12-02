// src/Components/Resources/Resources.jsx
import { useState } from 'react';
import { Card } from '../ui/Card';
import {
  Book,
  Phone,
  Link as LinkIcon,
  FileText,
  Heart,
  Presentation,
  Brain,
  Users,
  Bookmark,
  Search
} from 'lucide-react';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'crisis', label: 'Crisis Support' },
    { id: 'education', label: 'Educational' },
    { id: 'support', label: 'Support Groups' },
    { id: 'tools', label: 'Self-Help Tools' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Crisis Hotlines',
      category: 'crisis',
      description: '24/7 emergency support services for immediate assistance',
      items: [
        { name: 'National Crisis Line', value: '1-800-273-8255' },
        { name: 'Crisis Text Line', value: 'Text HOME to 741741' }
      ],
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      title: 'Support Group Materials',
      category: 'support',
      description: 'Resources available through our support groups',
      items: [
        { name: 'DBT Skills Training', link: '#' },
        { name: 'Addiction Recovery Literature', link: '#' },
        { name: 'Anger Management Workbook', link: '#' },
        { name: 'Emotional Intelligence Exercises', link: '#' }
      ],
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'Educational Resources',
      category: 'education',
      description: 'Learn more about mental health and well-being',
      items: [
        { name: 'Understanding BPD', link: '#' },
        { name: 'Addiction Recovery Basics', link: '#' },
        { name: 'Emotional Intelligence Guide', link: '#' },
        { name: 'Stress Management Techniques', link: '#' }
      ],
      icon: Book,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Self-Help Tools',
      category: 'tools',
      description: 'Interactive tools and worksheets for personal growth',
      items: [
        { name: 'Mood Tracking Templates', link: '#' },
        { name: 'Mindfulness Exercises', link: '#' },
        { name: 'Coping Skills Worksheet', link: '#' },
        { name: 'Personal Development Plan', link: '#' }
      ],
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      title: 'Group Guidelines',
      category: 'support',
      description: 'Essential information for participating in support groups',
      items: [
        { name: 'Confidentiality Agreement', link: '#' },
        { name: 'Meeting Guidelines', link: '#' },
        { name: 'Group Expectations', link: '#' },
        { name: 'Code of Conduct', link: '#' }
      ],
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resources & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive collection of resources designed to support your mental health journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:overflow-x-visible" style={{ flexWrap: "wrap" }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start space-x-4 space-y-4 md:space-y-0">
                <div className={`${resource.bgColor} p-3 rounded-lg`}>
                  <resource.icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <ul className="space-y-2">
                    {resource.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        {item.link ? (
                          <a
                            href={item.link}
                            className={`${resource.color} hover:underline flex items-center`}
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {item.name}
                          </a>
                        ) : (
                          <span className="flex items-center text-gray-700">
                            <Phone className="w-4 h-4 mr-2" />
                            {item.name}: <span className="font-medium ml-1">{item.value}</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-700">Need Immediate Help?</h3>
                <p className="text-red-600">
                  If you're in crisis or having thoughts of suicide, help is available 24/7.
                </p>
              </div>
            </div>
            <a
              href="tel:1-800-273-8255"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Get Help Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;