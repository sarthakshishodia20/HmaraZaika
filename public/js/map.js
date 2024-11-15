// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// let mapToken = "<%=process.env.MAP_TOKEN%>";
console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [77.209, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});
console.log(coordinates);


// const marker=new mapboxgl.Marker()
// .setLangLat([77.1025,28.7041])
// .addTo(map);
 