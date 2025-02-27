import React, { useEffect, useState } from 'react';
import { Select, InputNumber, Space, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomSelect = ({FieldName, customInput = {}, customInputChange, options = [] }) => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (options.length > 0) {
      const initialCounts = {};
      options.forEach((option) => {
        initialCounts[option.name] = 0;
      });
      customInputChange({ currentTarget: { name: FieldName, value: initialCounts } });
    }
    // This empty dependency array ensures the effect runs only once
  }, []); 

  const handleIncrease = (name) => {
    const count = { ...customInput[FieldName] };
    count[name] = count[name]? count[name]+1 : 1;
    customInputChange({ currentTarget: { name: FieldName, value: count } });
  };

  const handleDecrease = (name) => {
    const count = { ...customInput[FieldName] };
    count[name] = count[name] > 0 ? count[name] - 1 : 0;
    customInputChange({ currentTarget: { name: FieldName, value: count } });
  };

  
  const totalSelected = customInput[FieldName] && Object.values(customInput[FieldName]).reduce((acc, count) => acc + count, 0);

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Select a product"
      value={`Total ${FieldName}: ${totalSelected||0}`}
      dropdownRender={(menu) => (
        <div>
          {options.map((product, idx) => (
            <div key={idx.toString()} style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{product.name}</span>
              <Space>
                <Button
                  icon={<MinusOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease(product.name);
                  }}
                />
                <InputNumber
                  min={0}
                  value={customInput[FieldName] ? customInput[FieldName][product.name] : 0}
                  readOnly
                  style={{ width: 60 }}
                />
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(product.name);
                  }}
                />
              </Space>
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default CustomSelect;
