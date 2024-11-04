import styles from './DashboardLayout.module.css'; // Scoped styles for dashboard
import React from 'react';

const DashboardLayout = ({ children }) => {
  return <div className={styles.dashboardLayout}>{children}</div>;
};

export default DashboardLayout;