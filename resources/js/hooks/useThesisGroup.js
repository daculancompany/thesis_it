import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const groupList = async () => {
    const { data } = await axiosConfig.get(`/groups/thesis-group`);
    return data?.groups || [];
};

export default function useThesisGroup() {
    return useQuery(["thesis_group"], () => groupList(), {
        keepPreviousData: true,
    });
}
