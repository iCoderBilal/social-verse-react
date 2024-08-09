import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addData ,setLoading } from "../../store/admin";
import FlicToaster from "../FlicToaster";


export default function useAdminDataLoader() {
  const {data , isLoading } = useSelector((state)=> state.admin)
  const dispatch = useDispatch();
  useEffect(() => {
    if(!isLoading && data){
        return { data , isLoading}
    }
    dispatch(setLoading(true));

    axios
      .get('/admin/dashboard/data')
      .then((response) => {
        if(response.data.status === 'success'){
            dispatch(addData(response.data));
        }else{
            FlicToaster.error("data Not fectch")
        }
      })
      .catch((error) => {
        FlicToaster.error("Error fetching Admin");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);
  return {data ,isLoading}
}
