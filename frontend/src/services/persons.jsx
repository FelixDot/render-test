import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const reqest = axios.get(baseUrl);
  return reqest.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson);
  return request.then((response) => response.data);
};
export default {
  getAll,
  create,
  remove,
  update,
};
