import React,{useState} from 'react';
import { Steps } from 'antd';

const Stepper = ({ steps, CurrentStep,returnStepValue ,Selectable}) => {
  const [CurrentSteps,setCurrentSteps]=useState('');
  // Find the index of the current state
  const currentIndex = steps && steps.findIndex(step => step.title === CurrentStep);

  // This function is called when a step is clicked
  const handleOnStepClick = (data) => {
    const currentIndex = steps&&steps.findIndex(step => step.title === data);
    setCurrentSteps(currentIndex);
    // Log the clicked step title to the console
    console.log(data, 'step is clicked ',currentIndex);
    if(Selectable){
      
      returnStepValue(data)
    }
    // You can perform any action here, such as updating state or triggering a side effect
  };

  return (
    <Steps size="small" current={currentIndex >= 0 ? currentIndex : 0}>
      {steps && steps.map((step, index) => (
        <Steps.Step key={index}  onClick={() => handleOnStepClick(step.title)} title={step.title} style={{border:`${(Selectable &&CurrentSteps === index) ?'1px solid green':''}`,padding:`${ (Selectable &&CurrentSteps === index )?'3px 5px':''}`,borderRadius:`${(Selectable && CurrentSteps === index )?'10px':''}`}} />
      ))}
    </Steps>
  );
};

export default Stepper;
