// src/Components/Support/SupportGroupsOverview.jsx
import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Heart,
  Search,
  Users,
} from "lucide-react";

import { Card } from "../ui/Card";
import {
  getUserGroups,
  joinSupportGroup,
} from "../../services/supportGroupService";
import JoinGroupModal from "./JoinGroupModal";

import './supportGroup.css'

const SupportGroupsOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedGroup, setExpandedGroup] = useState(null);

  // JOIN GROUP:
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [userGroups, setUserGroups] = useState(new Set());
  const [joinSuccess, setJoinSuccess] = useState(null);

  // Added this effect to fetch user's joined groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getUserGroups();
        // groups will be an empty array if there's an error or user is not logged in
        setUserGroups(new Set(groups.map((g) => g.id)));
      } catch (error) {
        console.error("Failed to fetch user groups:", error);
        // Don't need to do anything else as getUserGroups already handles errors
      }
    };

    fetchGroups();
  }, []);

  // Add the join handler
  const handleJoinGroup = async (groupId) => {
    try {
      await joinSupportGroup(groupId);
      setUserGroups((prev) => new Set([...prev, groupId]));
      setJoiningGroup(null);
      setJoinSuccess({
        message: "Successfully joined the group!",
        groupId,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setJoinSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to join group:", error);
      throw error;
    }
  };

  const filters = [
    { id: "all", label: "All Groups" },
    { id: "addiction", label: "Addiction Recovery" },
    { id: "emotional", label: "Emotional Support" },
    { id: "behavioral", label: "Behavioral Change" },
    { id: "mental-health", label: "Mental Health" },
  ];

  const groups = [
    {
      id: "cga",
      name: "Criminal & Gang Anonymous (CGA)",
      description:
        "Support for individuals seeking to leave criminal lifestyles and gang affiliations.",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-50",
      category: ["behavioral", "addiction"],
      indicators: ["Angry", "Stressed", "Anxious"],
      meetingTimes: ["Monday 7PM", "Thursday 7PM"],
      resources: ["Counseling", "Job Training", "Legal Aid"],
      successRate: "78%",
      totalMembers: 234,
      nextSession: "2024-01-05T19:00:00",
      icon: "👥",
      testimonial:
        "This group helped me turn my life around. The support and resources are invaluable.",
    },
    {
      id: "aa",
      name: "Alcoholics Anonymous (AA)",
      description: "Support for individuals recovering from alcohol addiction.",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-50",
      category: "addiction",
      indicators: ["Stressed", "Overwhelmed", "Tired"],
      meetingTimes: ["Daily 6PM", "Saturday 10AM"],
      resources: ["12-Step Program", "Sponsor System", "Recovery Literature"],
      successRate: "82%",
      totalMembers: 456,
      nextSession: "2024-01-06T18:00:00",
      icon: "🌟",
      testimonial:
        "The 12-step program and sponsor support system gave me the structure I needed to recover.",
    },
    {
      id: "na",
      name: "Narcotics Anonymous (NA)",
      description: "Support for individuals recovering from drug addiction.",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-50",
      category: "addiction",
      indicators: ["Anxious", "Overwhelmed", "Tired"],
      meetingTimes: ["Daily 8PM", "Sunday 11AM"],
      resources: ["Recovery Program", "Peer Support", "Crisis Hotline"],
      successRate: "75%",
      totalMembers: 389,
      nextSession: "2024-01-06T20:00:00",
      icon: "💪",
      testimonial:
        "Found a community that understands my struggles and supports my recovery journey.",
    },
    {
      id: "bpd",
      name: "Borderline Personality Disorder Support",
      description:
        "Supportive environment for individuals managing BPD and their loved ones.",
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      hoverColor: "hover:bg-indigo-50",
      category: "mental-health",
      indicators: ["Emotional", "Relationship Issues", "Identity Concerns"],
      meetingTimes: ["Tuesday 7PM", "Friday 6PM"],
      resources: [
        "DBT Skills Training",
        "Crisis Management",
        "Family Education",
      ],
      successRate: "73%",
      totalMembers: 178,
      nextSession: "2024-01-09T19:00:00",
      icon: "🫂",
      testimonial:
        "Learning DBT skills in a supportive group setting has been transformative for managing my BPD.",
    },
    {
      id: "eid",
      name: "Emotional Intelligence Development",
      description: "Learn to understand and manage emotions effectively.",
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      hoverColor: "hover:bg-yellow-50",
      category: "emotional",
      indicators: ["Stressed", "Overwhelmed", "Sad"],
      meetingTimes: ["Tuesday 6PM", "Saturday 2PM"],
      resources: ["Workshops", "Personal Development", "Mindfulness Training"],
      successRate: "85%",
      totalMembers: 245,
      nextSession: "2024-01-07T14:00:00",
      icon: "🧠",
      testimonial:
        "The emotional awareness techniques I've learned here have improved all aspects of my life.",
    },
    {
      id: "anger",
      name: "Anger Management",
      description: "Develop skills to manage anger and aggressive responses.",
      color: "bg-red-500",
      lightColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      hoverColor: "hover:bg-red-50",
      category: "behavioral",
      indicators: ["Angry", "Stressed", "Overwhelmed"],
      meetingTimes: ["Wednesday 7PM", "Saturday 3PM"],
      resources: [
        "Coping Strategies",
        "Stress Management",
        "Communication Skills",
      ],
      successRate: "77%",
      totalMembers: 156,
      nextSession: "2024-01-10T19:00:00",
      icon: "🎯",
      testimonial:
        "I've learned to understand my triggers and respond instead of react.",
    },
  ];

  const activityStats = [
    { label: "Active Members", value: "500+", icon: Users },
    { label: "Success Rate", value: "85%", icon: Award },
    { label: "Weekly Sessions", value: "25", icon: Calendar },
    { label: "Support Hours", value: "100+", icon: Heart },
  ];

  const filterGroups = (groups) => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" ||
        (Array.isArray(group.category)
          ? group.category.includes(selectedFilter)
          : group.category === selectedFilter);
      return matchesSearch && matchesFilter;
    });
  };

  const toggleGroupExpansion = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const filteredGroups = filterGroups(groups);

  return (
    <div className="container mx-auto px-4 py-8 pt-20" style={{ paddingRight: 0 }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support Groups</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our supportive community where you can connect with others who
            understand your journey. Each group is led by trained facilitators
            and provides a safe, confidential space for sharing and healing.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {activityStats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search support groups..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className={`transform transition-all duration-300 hover:shadow-xl ${
                expandedGroup === group.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">{group.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold">{group.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${group.lightColor} ${group.textColor}`}
                          >
                            {group.successRate} Success Rate
                          </span>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${group.lightColor} ${group.textColor}`}
                          >
                            {group.totalMembers} Members
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{group.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      {/* Focus Areas */}
                      <div
                        className={`${group.lightColor} ${group.textColor} p-4 rounded-lg`}
                      >
                        <div className="flex items-center mb-3">
                          <AlertCircle size={18} className="mr-2" />
                          <h4 className="font-medium">Focus Areas</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          {group.indicators.map((indicator) => (
                            <li key={indicator} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-current mr-2" />
                              {indicator}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Meeting Times */}
                      <div
                        className={`${group.lightColor} ${group.textColor} p-4 rounded-lg`}
                      >
                        <div className="flex items-center mb-3">
                          <Clock size={18} className="mr-2" />
                          <h4 className="font-medium">Meeting Times</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          {group.meetingTimes.map((time) => (
                            <li key={time} className="flex items-center">
                              <Calendar size={14} className="mr-2" />
                              {time}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      <div
                        className={`${group.lightColor} ${group.textColor} p-4 rounded-lg`}
                      >
                        <div className="flex items-center mb-3">
                          <BookOpen size={18} className="mr-2" />
                          <h4 className="font-medium">Resources</h4>
                        </div>
                        <ul className="text-sm space-y-2">
                          {group.resources.map((resource) => (
                            <li key={resource} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-current mr-2" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {expandedGroup === group.id && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Member Testimonial</h4>
                        <p className="text-gray-600 italic">
                          {group.testimonial}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => setJoiningGroup(group)}
                        disabled={userGroups.has(group.id)}
                        className={`${
                          group.color
                        } text-white px-6 py-2 rounded-lg 
                          flex items-center transition-all
                          ${
                            userGroups.has(group.id)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:opacity-90"
                          }`}
                      >
                        {userGroups.has(group.id) ? (
                          <>
                            Member
                            <CheckCircle size={18} className="ml-2" />
                          </>
                        ) : (
                          <>
                            Join Group
                            <ArrowRight size={18} className="ml-2" />
                          </>
                        )}
                      </button>
                      <button
                      onClick={() => toggleGroupExpansion(group.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {expandedGroup === group.id ? "Show Less" : "Show More"}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* Add the modal */}
        {joiningGroup && (
          <JoinGroupModal
            group={joiningGroup}
            onClose={() => setJoiningGroup(null)}
            onJoin={handleJoinGroup}
          />
        )}
        {/* Add success message */}
        {joinSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {joinSuccess.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportGroupsOverview;
