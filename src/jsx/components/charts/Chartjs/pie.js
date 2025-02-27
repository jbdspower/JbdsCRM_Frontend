import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartPie = ({onClick, chartData = [], datalabels = [], colors = [], height, width }) => {
   const data = {
      datasets: [
         {
            data: chartData,
            borderWidth: 0,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
         },
      ],
      labels: datalabels, // Adjusted to match data length
   };

   const options = {
      plugins: {
         legend: false, // Hide default legend
         responsive: true,
         datalabels: {
            display: true, // Always show datalabels
            color: "#fff", // Label color
            font: {
               size: 14,
               weight: "normal", // Normal weight when not hovered
            },
            formatter: (value, ctx) => {
               const total = ctx.dataset.data.reduce((acc, curr) => acc + curr, 0);
               const percentage = ((value / total) * 100).toFixed(1) + '%'; // Percentage calculation
               return percentage;
            },
            anchor: 'end',
            align: 'start',
         },
      },
      maintainAspectRatio: false,
      onClick: (event, elements) => {
         if (elements.length > 0) {
            const index = elements[0].index;
            const label = data.labels[index];
            const value = data.datasets[0].data[index];

            // Perform any action when a slice is clicked
            onClick(label,value)
            //Modalert(`Clicked on slice: ${label} with value: ${value}`);
         }
      },
      hover: {
         onHover: (event, chartElement) => {
            // Optional: you can add custom behavior on hover, like changing styles
            if (chartElement.length) {
               chartElement[0].element.$context.active = true;
            }
         },
      },
   };

   return (
      <Pie
         data={data}
         height={height ? height : 200}
         width={width}
         options={options}
         plugins={[ChartDataLabels]} // Enable the datalabels plugin
      />
   );
};

export default ChartPie;
