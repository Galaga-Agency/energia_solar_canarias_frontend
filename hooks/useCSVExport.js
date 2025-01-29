import { useCallback } from "react";

const useCSVExport = () => {
  const downloadCSV = useCallback((data, filename = "data.csv") => {
    if (!data || data.length === 0) {
      console.warn("No data available for export.");
      return;
    }

    // Extract headers dynamically
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const rows = data.map((row) =>
      headers.map((fieldName) => `"${row[fieldName] ?? ""}"`).join(",")
    );

    // Create CSV content
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create Blob with BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a link and trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  return { downloadCSV };
};

export default useCSVExport;
