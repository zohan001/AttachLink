import api from "./client";

export const getMyEvaluations = () => api.get("/evaluations/my").then((r) => r.data.data);
export const getAttachmentEvaluations = (id) => api.get(`/evaluations/attachment/${id}`).then((r) => r.data.data);
export const getEvaluation = (id) => api.get(`/evaluations/${id}`).then((r) => r.data.data);
export const createEvaluation = (data) => api.post("/evaluations", data).then((r) => r.data.data);
export const updateEvaluation = (id, data) => api.put(`/evaluations/${id}`, data).then((r) => r.data.data);
export const submitEvaluation = (id) => api.patch(`/evaluations/${id}/submit`).then((r) => r.data.data);
export const deleteEvaluation = (id) => api.delete(`/evaluations/${id}`);
