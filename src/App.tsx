import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { useHostages } from './hooks/useHostages';
import { useMetrics } from './hooks/useMetrics';

const App: React.FC = () => {
  const { hostages, loading, error } = useHostages();
  const metrics = useMetrics(hostages);
  
  return (
    <Layout>
      <Dashboard
        hostages={hostages}
        metrics={metrics}
        loading={loading}
        error={error}
      />
    </Layout>
  );
};

export default App;

// Made with Bob
