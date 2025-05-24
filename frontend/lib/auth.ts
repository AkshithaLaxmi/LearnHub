import axios from "axios";

axios.defaults.withCredentials = true;

export async function getCurrentUser() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`,{withCredentials:true});
    return res.data; // contains user info
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null; // not logged in or error
  }
}