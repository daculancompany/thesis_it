import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { Button, Layout } from "~/components";
import { useEmployeeStore } from "~/states/employeeState";
import { FormEmployee } from "./index";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Divider, List, Typography } from "antd";

const EmployeePage = () => {
    const queryClient = useQueryClient();
    const [setCreateEmployee, dataemployees, employeeFetchList] = useEmployeeStore(
        (state) => [
            state.setCreateEmployee,
            state.employees,
            state.employeeFetchList,
        ],
        shallow
    );

    useEffect(() => {
        employeeFetchList();
    }, []);

    const { isLoading, error, data, isFetching } = useQuery("employees", () =>
        axios.get("http://127.0.0.1:8000/api/employees").then((res) => res.data)
    );
    let postMovie = {};

    // const mutation = useMutation((newStudents) => {
    //     //return axios.post("/todos", newStudents);
    //     return newStudents;
    // });

    const createEmployee = async ({ ...data }) => {
        const response = await fetch(`http://127.0.0.1:8000/api/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(response.json().message);
        }

        return response.json();
    };

    const mutation = useMutation(createEmployee, {
        onSuccess: () => {
            queryClient.invalidateQueries("employees");
        },
    });

    return (
        <Layout>
            <Button
                label="Create Employee"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateEmployee(true)}
            />
            <FormEmployee />
            <button
                onClick={() => {
                    mutation.mutate({
                        id: new Date(),
                        fname: "Niel",
                        lname: "Daculan",
                    });
                }}
            >
                Create Todo
            </button>
            <List
                bordered
                dataSource={data}
                renderItem={(employee) => (
                    <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text>{" "}
                        {employee?.fname} {employee?.lname} 
                    </List.Item>
                )}
            />
        </Layout>
    );
};

export default React.memo(EmployeePage);
