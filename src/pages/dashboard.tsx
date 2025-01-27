import 'chartist/dist/index.css';
import { LineChart, PieChart, BarChart } from 'chartist';
import React, { FunctionComponent, useEffect, useState } from 'react';
// import payload from 'payload';
import "../css/chartstyles.css"
/**
 * Helper: Get the past 5 weeks labels (including the current one).
 */
function getLastFiveWeeksLabelsIncludingCurrent() {
  const labels = [];
  const currentDate = new Date(); // Today's date
  currentDate.setHours(0, 0, 0, 0); // Normalize to start of day to avoid DST issues

  // Get the start of the current week (assuming Sunday as start, adjust as needed)
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

  for (let week = 0; week < 5; week++) {
    // Calculate start date of each week, starting with the current week
    const weekStartDate = new Date(startOfWeek.getTime() - week * oneWeekInMillis);
    // Format date as "MMM DD" e.g., "Mar 05"
    const label = weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // Since we are starting with the current week, insert labels in reverse order
    labels.unshift(label);
  }

  return labels;
}

const CustomDashboardView: FunctionComponent = () => {
  // -----------------------------
  // 1) State for "User" stats
  // -----------------------------
  const [userOnboardingData, setUserOnboardingData] = useState<number[]>([]);

  // For user type distribution (Student vs Admin)
  const [userTypeStats, setUserTypeStats] = useState<{ Student: number; Admin: number }>({
    Student: 0,
    Admin: 0,
  });

  // For user gender distribution (Male, Female, Other)
  const [userGenderStats, setUserGenderStats] = useState<{ Male: number; Female: number; Other: number }>({
    Male: 0,
    Female: 0,
    Other: 0,
  });

  // For user province distribution
  const [provinceData, setProvinceData] = useState<{ labels: string[]; series: number[] }>({
    labels: [],
    series: [],
  });

  // For user city distribution
  const [userCityData, setUserCityData] = useState<{ labels: string[]; series: number[] }>({
    labels: [],
    series: [],
  });

  // **NEW**: Age group distribution
  const [ageGroupData, setAgeGroupData] = useState<{ labels: string[]; series: number[] }>({
    labels: [],
    series: [],
  });

  // -----------------------------
  // 2) State for "Contact Us" stats (if still needed)
  // -----------------------------
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0, other: 0 });
  const [cityData, setCityData] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });
  const [studyTypeData, setStudyTypeData] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });

  // ----------------------------------------------------------------
  // A) Fetch USERS data to build user-based stats
  // ----------------------------------------------------------------
  useEffect(() => {
    fetch('/api/users?limit=1000&offset=0')
      .then((response) => response.json())
      .then((data) => {
        const { docs } = data; // docs = array of users from your Users collection
        const now = new Date();

        // -----------------------------------
        // 1) Onboarding / last 5 weeks
        // -----------------------------------
        const weeksData = docs.reduce((acc: any, user: any) => {
          // If your schema uses "created_at" instead of "createdAt", adjust accordingly:
          const createdAt = new Date(user.createdAt || user.created_at);
          const weekNumber = Math.floor(
            (now.getTime() - createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          acc[weekNumber] = (acc[weekNumber] || 0) + 1;
          return acc;
        }, {});

        // For the last 5 weeks (indices 0..4). Reverse to show newest on the right.
        const last5Weeks = Array.from({ length: 5 }).map((_, index) => {
          return weeksData[index] !== undefined ? weeksData[index] : 0;
        }).reverse();
        setUserOnboardingData([...last5Weeks]);

        // -----------------------------------
        // 2) User type distribution
        // -----------------------------------
        const initialUserTypeStats = { Student: 0, Admin: 0 };
        docs.forEach((user: any) => {
          if (user.user_type === 'Student') {
            initialUserTypeStats.Student += 1;
          } else if (user.user_type === 'Admin') {
            initialUserTypeStats.Admin += 1;
          }
        });
        setUserTypeStats(initialUserTypeStats);

        // -----------------------------------
        // 3) Gender distribution
        // -----------------------------------
        const initialUserGenderStats = { Male: 0, Female: 0, Other: 0 };
        docs.forEach((user: any) => {
          if (user.gender === 'Male') initialUserGenderStats.Male += 1;
          else if (user.gender === 'Female') initialUserGenderStats.Female += 1;
          else if (user.gender === 'Other') initialUserGenderStats.Other += 1;
        });
        setUserGenderStats(initialUserGenderStats);

        // -----------------------------------
        // 4) Province distribution
        // -----------------------------------
        const provinceCounts: Record<string, number> = {};
        docs.forEach((user: any) => {
          if (user.provinceOfDomicile) {
            provinceCounts[user.provinceOfDomicile] = 
              (provinceCounts[user.provinceOfDomicile] || 0) + 1;
          }
        });
        setProvinceData({
          labels: Object.keys(provinceCounts),
          series: Object.values(provinceCounts),
        });

        // -----------------------------------
        // 5) City distribution
        // -----------------------------------
        const cityCounts: Record<string, number> = {};
        docs.forEach((user: any) => {
          if (user.city) {
            cityCounts[user.city] = (cityCounts[user.city] || 0) + 1;
          }
        });
        setUserCityData({
          labels: Object.keys(cityCounts),
          series: Object.values(cityCounts),
        });

        // -----------------------------------
        // 6) Age group distribution
        //   Group by age brackets, e.g.:
        //   - Under 18
        //   - 18-25
        //   - 26-35
        //   - 36-45
        //   - 46-60
        //   - 60+
        // -----------------------------------
        const today = new Date();
        const ageGroups = {
          'Under 18': 0,
          '18-25': 0,
          '26-35': 0,
          '36-45': 0,
          '46-60': 0,
          '60+': 0,
        };

        docs.forEach((user: any) => {
          if (user.date_of_birth) {
            const dob = new Date(user.date_of_birth);
            if (!isNaN(dob.getTime())) {
              const birthYear = dob.getFullYear();
              const currentYear = today.getFullYear();
              const age = currentYear - birthYear;

              if (age < 18) {
                ageGroups['Under 18']++;
              } else if (age <= 25) {
                ageGroups['18-25']++;
              } else if (age <= 35) {
                ageGroups['26-35']++;
              } else if (age <= 45) {
                ageGroups['36-45']++;
              } else if (age <= 60) {
                ageGroups['46-60']++;
              } else {
                ageGroups['60+']++;
              }
            }
          }
        });

        setAgeGroupData({
          labels: Object.keys(ageGroups),
          series: Object.values(ageGroups),
        });
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  // ----------------------------------------------------------------
  // B) Fetch CONTACT-US data (if still needed)
  // ----------------------------------------------------------------
  useEffect(() => {
    fetch('/api/contact-us?limit=1000')
      .then((response) => response.json())
      .then((data) => {
        // Gender Stats
        const genderCounts = data.docs.reduce((acc: any, item: any) => {
          if (item.gender) {
            acc[item.gender] = (acc[item.gender] || 0) + 1;
          }
          return acc;
        }, { male: 0, female: 0, other: 0 });
        setGenderStats(genderCounts);

        // City Data
        const cityCounts = data.docs.reduce((acc: any, item: any) => {
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
        const studyTypeCounts = data.docs.reduce((acc: any, item: any) => {
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

  // ----------------------------------------------------------------
  // C) Render "Users" Charts
  // ----------------------------------------------------------------

  // 1) Users Onboarding (Line Chart)
  useEffect(() => {
    const labels = getLastFiveWeeksLabelsIncludingCurrent();
    new LineChart(
      '#userOnboardingChart',
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

  // 2) User Type (Pie Chart)
  useEffect(() => {
    new BarChart(
      '#userTypeBarChart', // Update container ID
      {
        labels: ['Student', 'Admin'], // Categories
        series: [[userTypeStats.Student, userTypeStats.Admin]], // Single series for bar chart
      },
      {
        axisX: {
          showGrid: false, // Hide grid for X-axis
        },
        axisY: {
          onlyInteger: true, // Y-axis shows whole numbers only
          offset: 20, // Adjust Y-axis label offset
        },
        low: 0, // Start Y-axis from 0
        chartPadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      }
    );
  }, [userTypeStats]);
  
  useEffect(() => {
    new BarChart(
      '#userGenderBarChart', // Update container ID
      {
        labels: ['Male', 'Female', 'Other'], // Gender categories
        series: [[userGenderStats.Male, userGenderStats.Female, userGenderStats.Other]], // Single series for bar chart
      },
      {
        axisX: {
          showGrid: false,
        },
        axisY: {
          onlyInteger: true,
          offset: 20,
        },
        low: 0,
        chartPadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      }
    );
  }, [userGenderStats]);
  
  

  // 4) Province (Bar Chart)
  useEffect(() => {
    new BarChart(
      '#userProvinceBarChart',
      {
        labels: provinceData.labels,
        series: [provinceData.series],
      },
      {
        axisX: {
          showGrid: false,
        },
        low: 0,
      }
    );
  }, [provinceData]);

  // 5) City (Bar Chart)
  useEffect(() => {
    new BarChart(
      '#userCityBarChart',
      {
        labels: userCityData.labels,
        series: [userCityData.series],
      },
      {
        axisX: {
          showGrid: false,
        },
        low: 0,
      }
    );
  }, [userCityData]);

  // **NEW** 6) Age Group (Bar Chart)
  useEffect(() => {
    new BarChart(
      '#ageGroupBarChart',
      {
        labels: ageGroupData.labels,
        series: [ageGroupData.series],
      },
      {
        axisX: {
          showGrid: false,
        },
        low: 0,
      }
    );
  }, [ageGroupData]);

  // ----------------------------------------------------------------
  // D) Render "Contact-Us" Charts (if still needed)
  // ----------------------------------------------------------------
  // Contact-Us: Gender
  useEffect(() => {
    new PieChart(
      '#contactUsGenderPieChart',
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

  // Contact-Us: City
  useEffect(() => {
    new BarChart(
      '#contactUsCityBarChart',
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

  // Contact-Us: Study Type
  useEffect(() => {
    new BarChart(
      '#contactUsStudyTypeBarChart',
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

  // ----------------------------------------------------------------
  // E) Final Layout
  // ----------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Row 1: Users Onboarding + User Type */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="userOnboardingChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Users Onboarding (Last 5 Weeks)</h4>
        </div>
        <div id="userTypeBarChart" style={{ height: '320px', width: '100%' }}>
          <h4 style={{ color: 'GrayText' }}>Users by Type</h4>
        </div>
      </div>

      {/* Row 2: User Gender + Province */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="userGenderBarChart" style={{ height: '320px', width: '100%' }}>
          <h4 style={{ color: 'GrayText' }}>Users by Gender</h4>
        </div>
        <div id="userProvinceBarChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Province of Domicile</h4>
        </div>
      </div>

      {/* Row 3: City distribution (Users) + Age Group */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="userCityBarChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>User City Distribution</h4>
        </div>
        <div id="ageGroupBarChart" style={{ height: '320px', width: '45%' }}>
          <h4 style={{ color: 'GrayText' }}>Age Group Distribution</h4>
        </div>
      </div>

      {/* --------------------------------------- */}
      {/* Contact Us Charts - if still needed */}
      {/* --------------------------------------- */}
      <hr />
      <h3 style={{ color: 'GrayText', marginLeft: '5%' }}>Contact-Us Stats</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div id="contactUsGenderPieChart" style={{ height: '320px', width: '30%' }}>
          <h4 style={{ color: 'GrayText' }}>Contact-Us: Gender</h4>
        </div>
        <div id="contactUsCityBarChart" style={{ height: '320px', width: '30%' }}>
          <h4 style={{ color: 'GrayText' }}>Contact-Us: City</h4>
        </div>
        <div id="contactUsStudyTypeBarChart" style={{ height: '320px', width: '30%' }}>
          <h4 style={{ color: 'GrayText' }}>Contact-Us: Study Level</h4>
        </div>
      </div>
    </div>
  );
};

export default CustomDashboardView;
