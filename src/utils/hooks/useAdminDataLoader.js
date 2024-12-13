import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addData, setLoading } from "../../store/admin";
import FlicToaster from "../FlicToaster";

export default function useAdminDataLoader() {
  const { data, isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  // Ensure the API is only called if data is missing and not currently loading
  useEffect(() => {
    if ((!data || data.length === 0) && isLoading) {
      dispatch(setLoading(true));
      console.log(data, isLoading);

      axios
        .get("/admin/dashboard/data")
        .then((response) => {
          if (response.data.status === "success") {
            dispatch(addData(response.data)); // Store the fetched data in Redux state
          } else {
            FlicToaster.error("Data not fetched");
          }
        })
        .catch((error) => {
          FlicToaster.error("Error fetching Admin data");
        })
        .finally(() => {
          dispatch(setLoading(false)); // Reset the loading state once API is complete
        });
    }
  }, [dispatch, isLoading, data]); // Runs whenever isLoading or data changes

  return { data, isLoading };
}