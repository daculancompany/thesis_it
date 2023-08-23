import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const thesisStages = async () => {
    const { data } = await axiosConfig.get(`/thesis-stages`);
    return data?.stages || [];
};

export default function useThesisStages() {
    return useQuery(["thesis_stages"], () => thesisStages(), {
        keepPreviousData: true,
    });
}
