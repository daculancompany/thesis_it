import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import  secureLocalStorage  from  "react-secure-storage";


const getThesis = async (page,perPage) => {
    const userID = secureLocalStorage.getItem("userID");
    const { data } = await axiosConfig.get("/students/thesis");
    return data?.thesis || [];
};

export default function useThesisStudent() {
    return useQuery(["thesisStudent"], () => getThesis(), {
        keepPreviousData: true,
    });
}
