import 'chartist/dist/index.css';
import { LineChart, PieChart, BarChart } from 'chartist';
import React, { FunctionComponent, useEffect, useState } from 'react';
import payload from 'payload';

const CustomDashboardView: FunctionComponent = () => {
  const [userOnboardingData, setUserOnboardingData] = useState<number[]>([]);
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0, other: 0 });
  const [cityData, setCityData] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });
  const [studyTypeData, setStudyTypeData] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });

  useEffect(() => {
    fetch('/api/users?limit=100&offset=0')
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const weeksData = data.docs.reduce((acc, user) => {
          const createdAt = new Date(user.createdAt);
          const weekNumber = Math.floor((now.getTime() - createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000));
          acc[weekNumber] = (acc[weekNumber] || 0) + 1;
          return acc;
        }, {});

        const last5Weeks = Array.from({ length: 5 }).map((_, index) => {
          return weeksData[index] !== undefined ? weeksData[index] : 0;
        }).reverse();

        setUserOnboardingData([...last5Weeks]);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  useEffect(() => {
    fetch('/api/contact-us?limit=1000')
      .then((response) => response.json())
      .then((data) => {
        // Gender Stats
        const genderCounts = data.docs.reduce((acc, item) => {
          if (item.gender) {
            acc[item.gender] = (acc[item.gender] || 0) + 1;
          }
          return acc;
        }, { male: 0, female: 0, other: 0 });
        setGenderStats(genderCounts);

        // City Data
        const cityCounts = data.docs.reduce((acc, item) => {
          if (item.study_country) {
            acc[item.study_country] = (acc[item.study_country] || 0) + 1;
          }
          return acc;
        }, {});
        setCityData({
          labels: Object.keys(cityCounts),
          series: Object.values(cityCounts),
        });

        // Study Type Data
        const studyTypeCounts = data.docs.reduce((acc, item) => {
          if (item.study_level) {
            acc[item.study_level] = (acc[item.study_level] || 0) + 1;
          }
          return acc;
        }, {});
        setStudyTypeData({
          labels: Object.keys(studyTypeCounts),
          series: Object.values(studyTypeCounts),
        });
      })
      .catch((error) => console.error('Error fetching contact-us data:', error));
  }, []);

  useEffect(() => {
    const labels = getLastFiveWeeksLabelsIncludingCurrent();

    new LineChart(
      '#chart',
      {
        labels: labels,
        series: [userOnboardingData],
      },
      {
        low: 0,
        showArea: true,
      }
    );
  }, [userOnboardingData]);

  useEffect(() => {
    new PieChart(
      '#genderPieChart',
      {
        series: Object.values(genderStats),
        labels: Object.keys(genderStats),
      },
      {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        showLabel: true,
      }
    );
  }, [genderStats]);

  useEffect(() => {
    new BarChart(
      '#cityBarChart',
      {
        labels: cityData.labels,
        series: [cityData.series],
      },
      {
        axisX: {
          showGrid: false,
        },
        low: 0,
      }
    );
  }, [cityData]);

  useEffect(() => {
    new BarChart(
      '#studyTypeBarChart',
      {
        labels: studyTypeData.labels,
        series: [studyTypeData.series],
      },
      {
        axisX: {
          showGrid: false,
        },
        low: 0,
      }
    );
  }, [studyTypeData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="chart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Users Onboarding Overview</h4>
        </div>
        <div id="genderPieChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Gender Distribution</h4>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="cityBarChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>City Distribution</h4>
        </div>
        <div id="studyTypeBarChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Study Type Distribution</h4>
        </div>
      </div>
    </div>
  );
};

export default CustomDashboardView;

function getLastFiveWeeksLabelsIncludingCurrent() {
  const labels = [];
  const currentDate = new Date(); // Today's date
  currentDate.setHours(0, 0, 0, 0); // Normalize to start of day to avoid DST issues

  // Get the start of the current week (assuming week starts on Sunday, adjust as needed)
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));

  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

  for (let week = 0; week < 5; week++) {
    // Calculate start date of each week, starting with the current week
    const weekStartDate = new Date(startOfWeek.getTime() - week * oneWeekInMillis);
    // Formatting date as "MMM DD" e.g., "Mar 05"
    const label = weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // Since we are starting with the current week, we need to insert the labels in reverse order
    labels.unshift(label);
  }

  return labels;
}
