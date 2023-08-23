import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getNotifications = async () => {  
    const { data } = await axiosConfig.get(`/notifications`);
    return data || [];
};

export default function useNotifications() {
    return useQuery(["notifications"], () => getNotifications(), {
        keepPreviousData: true,
    });
}

