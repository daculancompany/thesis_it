import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Pagination, Table, Tooltip, Button, message } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { FloatingButton, Layout } from "~/components";
import {useEmployees} from "~/hooks";
//import * as useEmployees from "~/hooks";
import { useEmployeeStore } from "~/states/employeeState";
import { FormEmployee } from "./index";
import { ERROR_MESSAGE } from '~/utils/constant'


const EmployeePage = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(0);
    const [
        setCreateEmployee,
        createNewEmployee,
        setEdit,
        editEmployee,
        setSubmit,
        perPage,
        setClear,
    ] = useEmployeeStore(
        (state) => [
            state.setCreateEmployee,
            state.createNewEmployee,
            state.setEdit,
            state.editEmployee,
            state.setSubmit,
            state.perPage,
            state.setClear,
        ],
        shallow
    );

    const {
        isLoading,
        data,
        isFetching,
    } = useEmployees(page,perPage);

    const mutation = useMutation(createNewEmployee, {
        onSuccess: (data) => {
            setSubmit(false); 
            if(data?.error) { 
                message.error(ERROR_MESSAGE); 
            }
            else{
                queryClient.invalidateQueries("employees");
                setClear(true);
                setCreateEmployee(false);
                message.success("New employee successfully create!"); 
            }
            
        },
    });

    const onShowSizeChange = (current, pageSize) => {
    };

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };
    
    const columns = [
        /*{
            title: "ID",
            dataIndex: "id",
            key: "id",
        },*/
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Contact Number",
            dataIndex: "contact_number",
            key: "contact_number",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Tooltip title="edit" color="cyan">
                    <Button
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCreateEmployee(true);
                            setEdit(value?.data);
                        }}
                    />
                </Tooltip>
            ),
        },
    ];

    let employee_list = [];
    let employee_array = Array.isArray(data?.employees) ? data?.employees : [];
    if (!isLoading) {
        for (let index = 0; index < employee_array.length; index++) {
            employee_list.push({
                key: index,
                id: employee_array[index].id,
                name: `${employee_array[index].fname} ${employee_array[index].lname}`,
                email: employee_array[index].email,
                contact_number: employee_array[index].contact_number,
                address: employee_array[index].address,
                data: employee_array[index],
            });
        }
    }

    return (
        <Layout>
            <div>
                <Table
                    loading={isFetching}
                    pagination={false}
                    columns={columns}
                    dataSource={employee_list}
                />
                {!isLoading && (
                    <Pagination
                        defaultCurrent={1}
                        total={data?.total || 0}
                        pageSize={perPage}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        onChange={onChange}
                        className="mt-5"
                    />
                )}
            </div>
            <FloatingButton
                label="Add Employee"
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                shape="round"
                onClick={() => setCreateEmployee(true)}
            />
            <FormEmployee
                submitForm={(params) => {
                    mutation.mutate({
                        fname: params.fname,
                        lname: params.lname,
                        email: params.email,
                        contact_number: params.contact_number,
                        address: params.address,
                        id: editEmployee?.id || null,
                        emp_id:editEmployee?.emp_id || null,
                    });
                    setSubmit(true);
                }}
            />
        </Layout>
    );
};

export default React.memo(EmployeePage);
