import * as XLSX from 'xlsx';

// Function to calculate relative date
export function getRelativeDate(inputDate) {
    const currentDate = new Date();
    const givenDate = new Date(inputDate);

    // Calculate the difference in time
    const timeDifference = currentDate - givenDate;

    // Calculate the difference in days
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (dayDifference === 0) {
        return "Today";
    } else if (dayDifference === 1) {
        return "Yesterday";
    } else {
        return `${dayDifference} days ago`;
    }
}

// Function to export a table to Excel
export function exportTableToExcel(id) {
    // Get the table element by id
    const table = document.getElementById(id);
    if (!table) {
        console.error(`Table with id '${id}' not found`);
        return;
    }

    const workbook = XLSX.utils.table_to_book(table);
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'TableExport.xlsx');
}

export default { getRelativeDate, exportTableToExcel };
