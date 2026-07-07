import toast from "react-hot-toast";

export const handleApiError = (err, fallback = "Something went wrong") => {
  const data = err.response?.data;
  if (data?.errors?.length) {
    data.errors.forEach((e) => toast.error(e.message));
  } else {
    toast.error(data?.message || fallback);
  }
};
