import { useQuery } from "react-query";
import axios from "axios";
import { getCookie } from "../utils/helper";
import axiosConfig from "~/utils/axiosConfig";

const getThesis = async (values) => {
    const userID =  getCookie("userID");
    //const { data } = await axios.get("/api/faculties/thesis?page=" + page+'&per_page='+perPage+'&user_id='+userID);
    const { data } = await axiosConfig.post("/thesis",{
        page: values?.queryKey[1],
        per_page: values?.queryKey[2],
        filter: values?.queryKey[3],
        user_id: userID,
       
    });
    return data?.thesis || [];
};
 
export default function useThesisFaculty(page,perPage, filterBy) {
    return useQuery(["thesisFaculties", page, perPage, filterBy], (datas) => getThesis(datas), {
        keepPreviousData: true,
    });
}
