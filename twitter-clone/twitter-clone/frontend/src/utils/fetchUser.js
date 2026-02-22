// authQuery.js
export const fetchAuthUser = async () => {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.error) return null;
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    console.log("authuser is here", data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
