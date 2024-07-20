import { useEffect, useState } from 'react';

export const useFetchData = (url) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState([]);

  const fetchData = async () => {
    try {
      const response = await window.fetch(url);
      if (!response.ok) throw new Error(`Error occurred: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData()
      .then((response) => setItems(response.data))
      .catch((e) => setError(e));
  }, []);

  return { items, error };
};
