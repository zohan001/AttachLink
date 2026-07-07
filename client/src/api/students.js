import api from "./client";

export const getMyStudentProfile = () => api.get("/students/me").then((r) => r.data.data);
export const getStudentProfile = (id) => api.get(`/students/${id}`).then((r) => r.data.data);
export const createStudentProfile = (data) => api.post("/students", data).then((r) => r.data.data);
export const updateStudentProfile = (id, data) => api.put(`/students/${id}`, data).then((r) => r.data.data);
export const getStudents = (params) => api.get("/students", { params }).then((r) => r.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
