import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { Button, Layout } from "~/components";
import { useStudentStore } from "~/states/studentState";
import { FormStudent } from "./index";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Divider, List, Typography } from "antd";

const StudentPage = () => {
    const queryClient = useQueryClient();
    const [setCreateStudent, datastudents, studentFetchList] = useStudentStore(
        (state) => [
            state.setCreateStudent,
            state.students,
            state.studentFetchList,
        ],
        shallow
    );

    useEffect(() => {
        studentFetchList();
    }, []);

    const { isLoading, error, data, isFetching } = useQuery("students", () =>
        axios.get("http://127.0.0.1:8000/api/students").then((res) => res.data)
    );
    let postMovie = {};

    // const mutation = useMutation((newStudents) => {
    //     //return axios.post("/todos", newStudents);
    //     return newStudents;
    // });

    const createStudent = async ({ ...data }) => {
        const response = await fetch(`http://127.0.0.1:8000/api/students`, {
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

    const mutation = useMutation(createStudent, {
        onSuccess: () => {
            queryClient.invalidateQueries("students");
        },
    });

    return (
        <Layout>
            <Button
                label="Create Student"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateStudent(true)}
            />
            <FormStudent />
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
                renderItem={(student) => (
                    <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text>{" "}
                        {student?.fname} {student?.lname}
                    </List.Item>
                )}
            />
        </Layout>
    );
};

export default React.memo(StudentPage);
