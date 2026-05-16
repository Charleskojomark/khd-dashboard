import { useState, useEffect } from 'react';
import { Hostage } from '../types/hostage.types';
import { saleorHostages } from '../data/saleorHostages';

// Constants
const SIMULATED_API_DELAY_MS = 800;

export const useHostages = () => {
  const [hostages, setHostages] = useState<Hostage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHostages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY_MS));
        
        // Use Saleor data
        setHostages(saleorHostages);
      } catch (err) {
        // Log full error for debugging
        console.error('Error fetching hostages:', err);
        // Set user-friendly error message
        setError(err instanceof Error ? err.message : 'Failed to load hostages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostages();
  }, []);
  
  return { hostages, loading, error };
};

// Made with Bob
