import React, { useEffect, useState } from 'react';
import { Flex, Switch, Table, Tag, Transfer } from 'antd';
import config from '../../../config.json'
import axiosInstance from '../../../../services/AxiosInstance';
import swal from 'sweetalert'
// Customize Table Transfer
const TableTransfer = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return (
        <Transfer
            style={{
                width: '100%',
            }}
            {...restProps}
        >
            {({
                direction,
                filteredItems,
                onItemSelect,
                onItemSelectAll,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled,
            }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;
                const rowSelection = {
                    getCheckboxProps: () => ({
                        disabled: listDisabled,
                    }),
                    onChange(selectedRowKeys) {
                        onItemSelectAll(selectedRowKeys, 'replace');
                    },
                    selectedRowKeys: listSelectedKeys,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                };
                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        style={{
                            pointerEvents: listDisabled ? 'none' : undefined,
                        }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) {
                                    return;
                                }
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );
};

const columns = [
    {
        dataIndex: 'name',
        title: 'Name',
    },
    {
        dataIndex: 'department',
        title: 'Department'
        // render: (tag) => (
        //   <Tag
        //     style={{
        //       marginInlineEnd: 0,
        //     }}
        //     color="cyan"
        //   >
        //     {tag.toUpperCase()}
        //   </Tag>
        //),
    }
];
const filterOption = (input, item) => item.title?.includes(input) || item.title?.includes(input);
const App = ({ AssignEmployee = [],ticketData,getAllTicket }) => {
    const [targetKeys, setTargetKeys] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [mockData, setMokData] = useState([]);
    useEffect(() => {
        getUsers()
    }, [])
   
    useEffect(() => {
        if (mockData.length > 0 && AssignEmployee.length > 0) {
            const arr=[]
            AssignEmployee.forEach((emp)=>{
                const index=mockData.findIndex(x=>x.name==emp)
                arr.push(index.toString())
            })
            setTargetKeys(arr);
        }
    }, [mockData, AssignEmployee])
    const getUsers = () => {
        axiosInstance.get(config.api + "user/employee")
            .then((result) => {
                setMokData(result.data.map((x, i) => { return { name: x.name, department: x.department, key: i.toString() } }))
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    // const toggleDisabled = (checked) => {
    //     setDisabled(checked);
    // };
    const renderItem = (item) => {
        // Disable the item if it's already in targetKeys
        const isDisabled = targetKeys.includes(item.key);

        return (
            <div style={{ opacity: isDisabled ? 0.5 : 1 }}>
                <span>{item.title}</span>
                <span>{item.description}</span>
            </div>
        );
    };

    const handleUpdate=()=>{
        let employee=targetKeys.map(key=>mockData[parseInt(key)])
        employee=employee.map((x)=>{return {label:x.name,value:x.name}})
        axiosInstance.patch(config.api + "updateTicketAssignee", { Assignee: employee, TicketId: ticketData.SR_ID })
        .then((result) => {
            getAllTicket()
            swal("Update Assignee Successfully");
        })
        .catch((err) => {
            swal(`${err}`);
        })
    }
    return (
        <>
         <Flex align="start" gap="middle" vertical>
            <TableTransfer
                titles={["All Employee", "Assigned Employee"]}
                dataSource={mockData}
                targetKeys={targetKeys}
                disabled={disabled}
                showSearch
                showSelectAll={false}
                onChange={onChange}
                filterOption={filterOption}
                leftColumns={columns}
                rightColumns={columns}
              //  render={renderItem}
            />
        </Flex>
        
        <button className='btn btn-sm btn-primary col-2  mt-4' onClick={handleUpdate}>Update</button>
        </>
       
    );
};
export default App;




// import React, { useEffect, useState } from 'react';
// import { Transfer } from 'antd';
// const AntdTransfer = () => {
//   const [mockData, setMockData] = useState([]);
//   const [targetKeys, setTargetKeys] = useState([]);
//   const getMock = () => {
//     const tempTargetKeys = [];
//     const tempMockData = [];
//     for (let i = 0; i < 20; i++) {
//       const data = {
//         key: i.toString(),
//         title: `content${i + 1}`,
//         description: `description of content${i + 1}`,
//         chosen: i % 2 === 0,
//       };
//       if (data.chosen) {
//         tempTargetKeys.push(data.key);
//       }
//       tempMockData.push(data);
//     }
//     setMockData(tempMockData);
//     setTargetKeys(tempTargetKeys);
//   };
//   useEffect(() => {
//     getMock();
//   }, []);
//   const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
//   const handleChange = (newTargetKeys) => {
//     setTargetKeys(newTargetKeys);
//   };
//   const handleSearch = (dir, value) => {
//     console.log('search:', dir, value);
//   };
//   return (
//     <Transfer
//       dataSource={mockData}
//       showSearch
//       filterOption={filterOption}
//       targetKeys={targetKeys}
//       onChange={handleChange}
//       onSearch={handleSearch}
//       render={(item) => item.title}
//     />
//   );
// };
// export default AntdTransfer;