import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import React from 'react';

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => (a.cases > b.cases) ? -1 : 1);
    return sortedData;
};


export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";


//Draw circles on the map with interactive tooltip
const casesTypeColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 180,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 400,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 650,
    },
};

export const showDataOnMap = (data, casesType) => 
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ));

