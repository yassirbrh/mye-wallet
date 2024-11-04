import styles from './MainLayout.module.css'; // Scoped styles for main pages
import React from 'react';

const MainLayout = ({ children }) => {
  return <div className={styles.mainLayout}>{children}</div>;
};

export default MainLayout;