import { toast } from "react-hot-toast";
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(value || 0);
};
export const formatToISODate = (date) => {
  if (!date) return null;

  let d;

  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string" && date.includes("/")) {
    // dd/MM/yyyy
    const [day, month, year] = date.split("/");
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(date);
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


export const showErrorToast = (err) => {
  const msg = err?.response?.data?.message ||   // axios-style
                    err?.message ||                   // thrown Error
                    "Save failed";
  toast.error(msg || "An unexpected error occurred");
}
 /* ------------------ Utils ------------------ */
export const formatAUD = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));


export const formattedDate = (v, segment = "/") => {
    if (!v) return "";

    const d = new Date(v);
    if (isNaN(d)) return "";

    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = d.getUTCFullYear();

    return `${dd}${segment}${mm}${segment}${yyyy}`;
}
export default formatCurrency;