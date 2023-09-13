import { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';
// import useAxiosPrivate from './useAxiosPrivate';

const useLocationMats = (locationId) => {
  // const axiosPrivate = useAxiosPrivate();
  const [locationMats, setLocationMats] = useState();

  const fetchLocationMats = useCallback(async () => {
    try {
      const response = await axios.get(
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
  }, [axiosPrivate, locationId]);

  useEffect(() => {
    fetchLocationMats();
  }, [fetchLocationMats]);

  return { locationMats, fetchLocationMats };
};

export default useLocationMats;
