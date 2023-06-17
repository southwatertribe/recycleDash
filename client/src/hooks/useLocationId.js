import { useEffect, useState, useCallback } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const useLocationData = (locationId) => {
  const axiosPrivate = useAxiosPrivate();
  const [locationMats, setLocationMats] = useState();

  const fetchLocationMats = useCallback(async () => {
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
  }, [axiosPrivate, locationId]);

  useEffect(() => {
    fetchLocationMats();
  }, [fetchLocationMats]);

  return { locationMats, fetchLocationMats };
};

export default useLocationData;
