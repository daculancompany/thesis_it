import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getDetails = async (id) => {
    const { data } = await axiosConfig.get(`/thesis/list-inline-comments/${id}`);
    return data;
};

export default function useScreenRecord(id) {
    return useQuery(["screen-record", id], () => getDetails(id), {
        keepPreviousData: true,
    });
}
