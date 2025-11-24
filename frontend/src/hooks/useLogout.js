import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
const BASE_URL = import.meta.env.VITE_API_URL;

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

	const logout = async () => {
		try {
			const res = await fetch(`${BASE_URL}/api/users/logout`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return logout;
};

export default useLogout;
