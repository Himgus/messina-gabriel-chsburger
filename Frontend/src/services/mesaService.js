import { request } from "./api.js";
export function getMesas() {
    return request("/mesas");
}
