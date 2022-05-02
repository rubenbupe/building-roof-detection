export const fetchPlace = async (text) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?types=place%2Cpostcode%2Caddress%2Clocality&access_token=pk.eyJ1IjoicGFjb2Q4IiwiYSI6ImNsMjI1MXBhaTFjcTMzY2xwNXR1Y25sdzQifQ.ZdLXjv82M_0WtDNPCSy5bg`
      );
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    } catch (err) {
      return { error: "Unable to retrieve places" };
    }
  };