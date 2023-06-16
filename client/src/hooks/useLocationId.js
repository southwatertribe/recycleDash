import { useEffect, useState } from 'react';

import useAxiosPrivate from './useAxiosPrivate';
const useLocationData = (locationId) => {
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, setLocationMats] = useState();
  const [total, setTotal] = useState();

  const fetchLocationMats = async () => {
    try {
      const response = await axiosPrivate.get(
        `/location-service/${locationId}/location_mats/`,
        {
          headers: { 'Content-Type': 'application/json' },
          params: {
            location_id: locationId,
          },
        }
      );
      console.log('Location Mats');
      setLocationMats(response.data);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log('Admin Dash Error: ');
      console.log(error);
    }
  };

  const fetchCashDrawerTotal = async () => {
    try {
      const response = await axiosPrivate.get(
        `/location-service/${locationId}/cash_drawer/total`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log(`cash: ${JSON.stringify(response.data)}`);
      setTotal(response.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCashDrawerTotal();
    fetchLocationMats();
  }, []);

  return { locationMats, total, fetchLocationMats, fetchCashDrawerTotal };
};

export default useLocationData;
