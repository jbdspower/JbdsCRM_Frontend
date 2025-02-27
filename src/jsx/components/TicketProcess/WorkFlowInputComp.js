import React from "react";
import {
  DropDownInputCompForObject,
  DropDownInputCompForObject1,
  TextInputComp,
  TextInputFieldComp,
} from "../../utill/testreusablecomponent";
import RemarkComponent from "../FormComponent/RemarkComponent";
import ToggleSwitchComp from "../FormComponent/ToggleSwitchComp";
import _ from "lodash";
import BreackGDownComp from "../FormComponent/BreackDownComponent";

const WorkFlowInputComp = ({
  input,
  handleOnComponentStateChange,
  handleOnChange,
  stateData,
  MoldList,
  RefreshState,
  returnValue,
  PreviousEquipmentdata,
  actionStatus,
  MoldID

}) => {
  const renderComponent = () => {
    switch (input.inputtype) {
      case 'toggle':
        return (
          <ToggleSwitchComp
            OnState={input.fieldinfo.OnState}
            OffState={input.fieldinfo.OffState}
            onComponentStateChange={handleOnComponentStateChange}
          />
        );
      case 'MixedComponent1':
        // return (
        //   <SparePartComponent
        //     onComponentStateChange={handleOnComponentStateChange}
        //   />
        // );
      case 'TextInputComp':
        return (
          <TextInputComp
            title={input.fieldinfo.title}
            Name={input.fieldinfo.name}
            data={input.fieldinfo.Data}
            option={input.fieldinfo.option}
            returnValue={(data) => returnValue(data)}
            type="text"
          />
        );
      case 'InputText':
        return (
          <TextInputFieldComp
            title={input.fieldinfo.title}
            Name={input.fieldinfo.name}
            data={input.fieldinfo.Data}
            option={input.fieldinfo.option}
            returnValue={(data) => returnValue(data)}
            type="text"
          />
        );
      case 'Dropdown':
        return (
          <DropDownInputCompForObject
            title={input.fieldinfo.title}
            Name={input.fieldinfo.name}
            data={input.fieldinfo.Data}
            option={input.fieldinfo.option}
            returnValue={(data) => returnValue(data)}
          />
        );
        case 'PMCheckSheet':
          return (<BreackGDownComp checksheet={''} MoldID={MoldID} returnValue={(data)=>returnValue({"PM":data})}/>);

          case 'PMPreprationComponent':
            // return (<PmPrepartionEntry MoldID={MoldID} returnValue={(data)=>returnValue({"PMPreparation":data})}/>);
      case 'Dropdown1':
        return (
          <DropDownInputCompForObject1
            title={input.fieldinfo.title}
            Name={input.fieldinfo.name}
            data={input.fieldinfo.Data}
            option={input.fieldinfo.option}
            returnValue={(data) => returnValue(data)}
          />
        );
      case 'Simple':
        return (
          <div className="col-sm-4">
            <div className="form-group text-center">
              <label>Mould ID</label>
              <select
                className="custom-select form-control"
                name="MoldId"
                onChange={handleOnChange}
                defaultValue={stateData.MoldId}
              >
                <option> Select Mould ID</option>
                {MoldList.map((one) => (
                  <option key={one.MoldId}>{one.MoldId}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'WhyWhyComp':
        // return (
        //   <WhyWhyComp
        //     Title={input.fieldinfo.title}
        //     name={input.fieldinfo.name}
        //     onComponentStateChange={handleOnComponentStateChange}
        //     RefreshState={RefreshState}
        //   />
        // );
      case 'Remarkarray':
        return (
          <RemarkComponent
            Title={input.fieldinfo.title}
            name={input.fieldinfo.name}
            onComponentStateChange={handleOnComponentStateChange}
            RefreshState={RefreshState}
          />
        );
      case 'CheckSheetComponent':
        return (
          <BreackGDownComp
            returnValue={(data) => returnValue({ PM: data })}
          />
        );
        case 'DailyCheckSheetEntry':
    //    return (<DailyCheckSheetTabs
    //     actionStatus={actionStatus}
    //     Equip={PreviousEquipmentdata}
    //     ReturnData={(data) =>
    //       returnValue({ Equipments: data })
    //     }
    //   />);
      
      case 'DateInputField':
       if (actionStatus === "update") {
            return null;
          } else {
            return (
              <div className="col-sm-4">
              <div className="form-group text-center">

            <label className="text-center"> 
            Date Time </label>
            
            <input
              className="rounded  form-control"
              style={{ border: "none",width:'100%' ,backgroundColor:'#FFFFFF',border:'1px solid #e9ecef' }}
              type="date"
              name="DateTime"
              onChange={(e) => {
                returnValue({
                  DateTime: e.currentTarget.value,
                });
              }}
            />
          </div>
          </div>
            );
          }
          case 'Loading':
        // if(MoldID){
        //   console.log("Loading_vkshbvk", MoldID)
        //   return (<LoadingDataComp  MoldID={MoldID} returnValue={(data)=>returnValue({"Loading":data})}/>);
        // }
          case 'UnLoading':
        // if(stateData.MoldId){
        //   return (<UnloadingDataComp  MoldID={stateData.MoldId} returnValue={(data)=>returnValue({"Unloading":data})}/>);
        // }
      
        // case 'Readiness':
        // if(stateData.MoldId){
        //   return (<MoldReadiness  MoldID={stateData.MoldId} returnValue={(data)=>returnValue({"Readiness":data})}/>);
        // }
        // case 'Setup':
        //   if(MoldID){
        //     return (<MouldSetUp  MoldID={MoldID} returnValue={(data)=>returnValue({"Setup":data})}/>);
        //   }
        
      
      default:
        return null;
    }
  };

  return (
    < >
      {renderComponent()}
    </>
  );
};

export default WorkFlowInputComp;
