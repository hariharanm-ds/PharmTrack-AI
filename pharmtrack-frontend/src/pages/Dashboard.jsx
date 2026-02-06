import React, { useState } from 'react';
import './Dashboard.css';
const Dashboard = () => {
  const [stats, setStats] = useState({
    taskCompletion: 85,
    pendingTasks: 3,
    overdueItems: 2,
    engagementScore: 78
  });

  const [todaySchedule, setTodaySchedule] = useState([
    { time: '08:00', task: 'Initial Setup', detail: 'Verify 500 records', done: true },
    { time: '14:00', task: 'Review Data', detail: 'Check 1000 items', done: false },
    { time: '20:00', task: 'Deployment Prep', detail: 'Check server status', done: false }
  ]);

  const [metrics, setMetrics] = useState({
    resourceLoad: { current: 120, max: 80, status: 'Optimal' },
    latency: 72, // ms
    throughput: 98.6, // MB/s
    volume: 70, // TB
    efficiency: 22.8
  });

  const [recentActivities, setRecentActivities] = useState([
    // These objects now only reference a 'type' for CSS coloring, icons are rendered via SVG logic
    { type: 'task', text: 'Completed Initial Setup', time: '2 hours ago', iconKey: 'Pill' },
    { type: 'consult', text: 'Launched Feature Audit', time: '5 hours ago', iconKey: 'Activity' },
    { type: 'security', text: 'Updated Security Settings', time: '1 day ago', iconKey: 'AlertCircle' },
    { type: 'profile', text: 'Updated User Profile', time: '2 days ago', iconKey: 'Heart' }
  ]);

  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: 'Mon', compliance: 90 },
    { day: 'Tue', compliance: 85 },
    { day: 'Wed', compliance: 95 },
    { day: 'Thu', compliance: 80 },
    { day: 'Fri', compliance: 85 },
    { day: 'Sat', compliance: 75 },
    { day: 'Sun', compliance: 90 }
  ]);

  const markAsDone = (index) => {
    const newSchedule = [...todaySchedule];
    newSchedule[index].done = true;
    setTodaySchedule(newSchedule);
    setStats(prev => ({ ...prev, pendingTasks: prev.pendingTasks - 1 }));
  };

  // Helper function to render SVG icons based on a key
  const renderIcon = (key, className) => {
    // Note: The 'icon-key-...' classes are used to map the SVG to the correct styling.
    switch (key) {
      case 'Activity':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      case 'Heart':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
      case 'Pill':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 12 2-2M18 10a8 8 0 1 0-8 8H4"/><path d="m21 15-3 3"/></svg>;
      case 'AlertCircle':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
      case 'Calendar':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
      case 'TrendingUp':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
      case 'Clock':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
      case 'Droplets':
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16a5 5 0 1 1 5 5V7a1 1 0 0 0 0-2 7 7 0 1 0-7 7"/></svg>;
      default:
        return null;
    }
  };


  return (
    <div className="dashboard-container">
      <div className="max-w-container">
        
        {/* Header */}
        <div className="header-card">
          <div className="header-content-wrapper">
            <div className="header-content-left">
              <div className="header-icon-wrapper bg-gradient-main">
                {renderIcon('Activity', 'icon-main')}
              </div>
              <div>
                <h1 className="header-title">User Analytics Dashboard</h1>
                <p className="header-subtitle">Your complete performance overview</p>
              </div>
            </div>
            <div className="date-display">
              {renderIcon('Calendar', 'icon-sm text-gray')}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card bg-gradient-score">
            <div className="metric-header">
              {renderIcon('Activity', 'icon-metric')}
              <span className="metric-value">{stats.engagementScore}</span>
            </div>
            <p className="metric-label">Engagement Score</p>
            <div className="metric-progress-bar">
              <div className="metric-progress-fill bg-white" style={{ width: `${stats.engagementScore}%` }}></div>
            </div>
          </div>

          <div className="metric-card bg-gradient-completion">
            <div className="metric-header">
              {renderIcon('Pill', 'icon-metric')}
              <span className="metric-value">{stats.taskCompletion}%</span>
            </div>
            <p className="metric-label">Task Completion</p>
            <div className="metric-progress-bar">
              <div className="metric-progress-fill bg-white" style={{ width: `${stats.taskCompletion}%` }}></div>
            </div>
          </div>

          <div className="metric-card bg-gradient-pending">
            <div className="metric-header">
              {renderIcon('Clock', 'icon-metric')}
              <span className="metric-value">{stats.pendingTasks}</span>
            </div>
            <p className="metric-label">Pending Tasks</p>
            <p className="metric-footer">Today's schedule</p>
          </div>

          <div className="metric-card bg-gradient-overdue">
            <div className="metric-header">
              {renderIcon('AlertCircle', 'icon-metric')}
              <span className="metric-value">{stats.overdueItems}</span>
            </div>
            <p className="metric-label">Overdue Items</p>
            <p className="metric-footer">Try to improve!</p>
          </div>
        </div>

        <div className="content-grid">
          
          {/* Left Column */}
          <div className="main-content-column">
            
            {/* Today's Task Schedule */}
            <div className="card">
              <h2 className="card-title">
                {renderIcon('Pill', 'icon-title text-blue')}
                Today's Task Schedule
              </h2>
              <div className="schedule-list">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className={`schedule-item ${item.done ? 'bg-done border-done' : 'bg-pending border-pending'}`}>
                    <div className="schedule-content">
                      <div className={`time-box ${item.done ? 'bg-green-primary' : 'bg-blue-primary'}`}>
                        {item.time}
                      </div>
                      <div>
                        <h3 className="task-name">{item.task}</h3>
                        <p className="task-detail">{item.detail}</p>
                      </div>
                    </div>
                    {item.done ? (
                      <div className="status-badge bg-green-primary">
                        ✓ Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => markAsDone(idx)}
                        className="btn-mark-done"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Completion Trend */}
            <div className="card">
              <h2 className="card-title">
                {renderIcon('TrendingUp', 'icon-title text-green')}
                Weekly Completion Trend
              </h2>
              <div className="chart-container">
                {weeklyTrend.map((day, idx) => (
                  <div key={idx} className="chart-bar-column">
                    <div className="chart-bar-wrapper">
                      <div
                        className={`chart-bar-fill ${
                          day.compliance >= 90 ? 'bg-green-primary' :
                          day.compliance >= 75 ? 'bg-yellow-primary' :
                          'bg-red-primary'
                        }`}
                        style={{ height: `${day.compliance}%` }}
                      >
                        <span className="chart-label-value">
                          {day.compliance}%
                        </span>
                      </div>
                    </div>
                    <span className="chart-label-day">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="sidebar-column">
            
            {/* System Metrics */}
            <div className="card">
              <h2 className="card-title">
                {renderIcon('Heart', 'icon-title text-red')}
                System Metrics
              </h2>
              <div className="metrics-list">
                <div className="metric-item bg-red-light">
                  <div className="metric-item-header">
                    <span className="metric-item-label">Resource Load</span>
                    {renderIcon('Droplets', 'icon-sm text-red')}
                  </div>
                  <div className="metric-item-value">
                    {metrics.resourceLoad.current}/{metrics.resourceLoad.max}
                  </div>
                  <span className={`metric-item-status text-green`}>{metrics.resourceLoad.status}</span>
                </div>

                <div className="metric-item bg-pink-light">
                  <div className="metric-item-header">
                    <span className="metric-item-label">Latency</span>
                    {renderIcon('Heart', 'icon-sm text-pink')}
                  </div>
                  <div className="metric-item-value">{metrics.latency} ms</div>
                  <span className={`metric-item-status text-green`}>Optimal</span>
                </div>

                <div className="metric-item bg-orange-light">
                  <div className="metric-item-header">
                    <span className="metric-item-label">Throughput</span>
                    {renderIcon('Activity', 'icon-sm text-orange')}
                  </div>
                  <div className="metric-item-value">{metrics.throughput} MB/s</div>
                  <span className={`metric-item-status text-green`}>Stable</span>
                </div>

                <div className="metrics-compact-grid">
                  <div className="metric-item bg-blue-light">
                    <span className="metric-item-label-sm">Volume</span>
                    <div className="metric-item-value-sm">{metrics.volume} TB</div>
                  </div>
                  <div className="metric-item bg-purple-light">
                    <span className="metric-item-label-sm">Efficiency</span>
                    <div className="metric-item-value-sm">{metrics.efficiency}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="card-title">Recent Activity</h2>
              <div className="activity-list">
                {recentActivities.map((activity, idx) => {
                  let colorClass;
                  if (activity.type === 'security') colorClass = 'bg-red-primary';
                  else if (activity.type === 'task') colorClass = 'bg-blue-primary';
                  else if (activity.type === 'consult') colorClass = 'bg-purple-primary';
                  else colorClass = 'bg-green-primary';

                  return (
                    <div key={idx} className="activity-item">
                      <div className={`activity-icon-wrapper ${colorClass}`}>
                        {renderIcon(activity.iconKey, 'icon-xs text-white')}
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">{activity.text}</p>
                        <p className="activity-time">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="action-card bg-gradient-main">
              <h3 className="action-card-title">Quick Actions</h3>
              <div className="action-list">
                <button className="btn-action">
                  Launch AI Assistant
                </button>
                <button className="btn-action">
                  View Performance Reports
                </button>
                <button className="btn-action">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;