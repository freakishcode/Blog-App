import { useState, useEffect } from "react";

// Note: install axios in terminal with: npm i axios
import axios from "axios";

function useCustomAxiosFetch(url) {
  const [data, setData] = useState([]); // state to store fetch data
  const [Loading, setLoading] = useState(true); // state to store loading boolean when fetching data
  const [error, setError] = useState(null); // state to store error message

  useEffect(() => {
    try {
      axios.get(url).then((response) => {
        console.log(response);
        setData(response.data);
      });
    } catch (err) {
      setError(err);
      console.error(`${err} failed to fetch data`);
    } finally {
      setLoading(false); //after json file have been provided remove loading display text
    }

    //   CLEAN UP METHOD: clean up function
    // return () => {
    //   controller.abort();
    //   console.log("fetch data aborted ");
    // };
  }, [url]);

  return { data, Loading, error };

  //NOTE FOR PARENT COMPONENT ONLY
  //conditional statement for  to display loading if page is still fetching data, display this on page
  //   if (Loading) return;
  //   <h1 style={{ color: "blue", fontsize: "30px" }}>Loading JSON API.....</h1>;

  //   //conditional statement for if there was an Error in fetching data display this on page
  //   if (error)
  //     return (
  //       <h1 style={{ color: "red", fontsize: "30px" }}>
  //         SOMETHING WENT WRONG, UNABLE TO DISPLAY FETCH DATA, PLZ.. TRY AGAIN.
  //       </h1>
  //     );
}

export default useCustomAxiosFetch;
