import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
// import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import mapData from "./topology.json";
import "./proj4-module"; // Proj4 is needed to draw bubbles on the map. Without it you will encounter the beautiful Highcharts error #21

const options = {
  chart: {
    height: 500, // 16:9 ratio
  },
  credits: {
    enabled: false,
  },
  mapNavigation: {
    enabled: true,
  },
  tooltip: {
    headerFormat: "",
    pointFormat:
      "<b>{point.z}</b><br><b>{point.name}</b> <br>lat: {point.lat}, lon: {point.lon}",
  },
  series: [
    {
      // Use the gb-all map with no data as a basemap
      name: "Basemap",
      mapData: mapData,
      borderColor: "#A0A0A0",
      nullColor: "rgba(200, 200, 200, 0.3)",
      showInLegend: false,
    },
    {
      type: "mapbubble",
      name: "tower",
      color: "#000",
      data: [
        {
          data: {},
          lat: 22.9734, //latitude
          lon: 78.6569, //longitude
          z: 10,
          color: "green",
          name: "MP",
        },
      ],
      marker: {
        symbol:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/klEQVR4nO2WT0uUURTGf+afMF2ZgrRpaJVCrpRK/QJitCmacNoYEeTSFmp9AAVdCW4FF0IZ7oqWQdoX0KhNzoTaIpghF4OEC0cOPEOHiyO+4x1p4QMH3ufcc+5z33vPPe8LF/gPMADMAVeqyLWcWaA/aWITkANKwJ0qhO8qN6e5To3HSswC9UAjMAn0npDTp5hG5WQ1x6PTy8JbJY2LPxU3fyWsKGZU/KX4myTC5dXeFF8PVj8M7AI7wJB8acV8Fu8W30oivK+kZvGCeJv4jrjZtnxt4nnxZvH9mMK7TtgWYbgaQzirpK5gq207DUtO2J59QYZb/SOJcKXiWlHV5p1wXr53MYorfcx1eg3cBu5pbENWks/GXp31OjW5BmIdzGNZ/ilZST6PAbfwRA3EMAjMA638QwtQBA6B60BKz8UgrlW5NkcUjOhN1sQvAd/ky1BDvJfIGPAA+OqKzMZqgnbgwJ1dyT0fyDpqITzmxMx+AxPAZeCDfC9qIbzmRPeA+0CdxjLB2UdDStX717VTs+/aic6g2qNhyt3Xdn13t4Md+OPudzRsug5VRgPwEPgSnL11syjo0YQF14VuAM/Vu8tv6u1WDOEZTWaNYjX4QPizXgA+ik/HEP55jJD18UXgCXDNxQ5W89dRCfYt/qXCeqZtroQ6xX86IeYCnCuOAOtqvuCcT8YYAAAAAElFTkSuQmCC)",
      },
    },
    {
      type: "mapbubble",
      name: "Devices",
      color: "#4169E1",
      data: [
        {
          data: {},
          lat: 22.9868, //latitude
          lon: 87.855, //longitude
          z: 2,
          color: "green",
          name: "west bangal",
        },
        {
          data: {},
          z: 2,
          lat: 22.6708,
          lon: 71.5724,
          color: "orange",
          name: "Gujrat",
        },
      ],
      cursor: "pointer",
      point: {
        events: {
          click: function () {
            console.log(this.keyword);
          },
        },
      },
    },
  ],
};

const Topology = () => {
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"mapChart"}
        options={options}
      />
    </div>
  );
};

export default Topology;
