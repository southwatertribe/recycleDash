import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import useLocationMats from '../../hooks/useLocationId';
import LocationMatCard from './LocationMatCard';
import "../../styles/locationdash.css";

const LocationInfo = ({ location }) => {
    const { locationMats, fetchLocationMats } = useLocationMats(location);
    const [cashDrawerTotal, setCashDrawerTotal] = useState('');

    const fetchCashDrawerTotal = async () => {
        try {
            const response = await axios.get(`/location-service/${location}/cash_drawer/total`);
            const newTotal = response.data.total;
            console.log("Total fetched");
            setCashDrawerTotal(newTotal);
            console.log(cashDrawerTotal);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLocationMats();
        fetchCashDrawerTotal();
    }, [fetchLocationMats]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginRight: '200px' }}>
                    <h2>Cash</h2>
                    {cashDrawerTotal < 0 ? (
                        <div style={{ color: 'red', fontSize: 30 }}>-${Math.abs(cashDrawerTotal)}</div>
                    ) : (
                        <div style={{ color: 'green', fontSize: 30 }}>$ {cashDrawerTotal}</div>
                    )}
                </div>

               <div>
                <h2>Location Materials</h2>
                 <div className="location-mats-grid">
                      {locationMats ? (
                          locationMats.map((locationMat, i) => (
                              <LocationMatCard key={i} {...{ ...locationMat }} />
                          ))
                      ) : (
                          <p>Materials failed to load</p>
                      )}
                  </div>
               </div>
            </div>
        </div>
    );
};

export default LocationInfo;
