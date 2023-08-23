import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const getThesis = async () => {
    const { data } = await axiosConfig.get(`/thesis`);
    return data?.thesis;
};

export default function useThesis() {
    return useQuery(["thesis"], () => getThesis(), {
        keepPreviousData: true,
    });
}
