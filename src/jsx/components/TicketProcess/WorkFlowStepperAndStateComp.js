import React from 'react';
import Stepper from './Stepper'; // Ensure you have the correct path for your Stepper component
// import WorkFlowInputComp from './WorkFlowInputComp'; // Ensure you have the correct path for your WorkFlowInputComp component
// import { isDate } from 'lodash';
// import moment from 'moment';


function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
const WorkFlowStepperAndStateComp = ({
  currentState,
  stepperList
  
}) => {
  return (
    <div style={{ width: "100%",overflowY:"scroll"}} className="nav-scroll">
       <div className='p-3 ' style={{position:'relative'}}>
        <div className="">

        <Stepper
          steps={stepperList}
          CurrentStep={currentState.StateName}
          Selectable={false}
          />
          </div>
         
      </div>
     
    </div>
  );
};

export default WorkFlowStepperAndStateComp;

