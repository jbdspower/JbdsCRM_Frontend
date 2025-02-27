import axios from 'axios';
import { store } from '../store/store';
import { jwtDecode } from 'jwt-decode'
setJwt()
function setJwt() {
    try {
        const state = store.getState();
        const token = state.auth.auth.idToken;
        const data = jwtDecode(token)
        axios.defaults.headers.common["authorization"] = token;
        // axios.defaults.headers.common["rights"] = rights;
        // // consol(rights)

        axios.defaults.headers.common["Company"] = data ? data.company : '';
        axios.defaults.headers.common["id"] = data ? data._id : '';
        axios.defaults.headers.common["Name"] = data ? data.name : '';
        axios.defaults.headers.common["UserName"] = data ? data.email : '';
        axios.defaults.headers.common["Access-Control-Allow-Origin"] = '*';
        // axios.defaults.headers.common["PlantName"] = data ?data.plants[0].plantName:'';
        return true
    }
    catch (e) {
        return false
    }
}


const axiosInstance = axios.create({
    baseURL: `http://localhost:4002/LeafNetServer/api/`,
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.auth.idToken;
    config.params = config.params || {};
    config.params['auth'] = token;
    config.headers['Authorization'] = token;
    return config;
});

export default axiosInstance;
