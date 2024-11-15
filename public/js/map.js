// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// let mapToken = "<%=process.env.MAP_TOKEN%>";
console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});
// console.log(coordinates);


const marker=new mapboxgl.Marker({color: "green"})
.setLngLat(coordinates)
.setPopup(
  new mapboxgl.Popup({offset:25}).setHTML(
    "<h6>AAO KABHI KHANE</h6>"
  )
)
.addTo(map);
 