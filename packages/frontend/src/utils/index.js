const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined"
    ? true
    : false;

const truncateAddress = (address, firstSegLength = 5, lastSegLength = 4) => {
  if (!address) return "";
  return address
    ? address.slice(0, firstSegLength) +
        "..." +
        address.slice(address.length - lastSegLength)
    : "...";
};

const IPFSHashPrefix = "0x1220";

const delIPFSPrefix = (hash) => {
  return "0x" + hash.replace(IPFSHashPrefix, "");
};
const addIPFSPrefix = (hash) => {
  return IPFSHashPrefix + hash.replace("0x", "");
};

const authHeader = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

const saveAuthToStore = ({ account, token, refreshToken }) => {
  localStorage.setItem("account", account);
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};
const getAuthFromStore = () => {
  return {
    storeAccount: localStorage.getItem("account"),
    storeToken: localStorage.getItem("token"),
    storeRefreshToken: localStorage.getItem("refreshToken"),
  };
};
const removeAuthFromStore = () => {
  localStorage.removeItem("account");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const isTokenExpired = (token) => {
  if (!token) {
    return null;
  }

  const jwt = JSON.parse(atob(token.split(".")[1]));

  const exp = (jwt && jwt.exp && jwt.exp * 1000) || null;

  if (!exp) {
    return false;
  }

  return Date.now() > exp;
};

export {
  isBrowser,
  truncateAddress,
  delIPFSPrefix,
  addIPFSPrefix,
  authHeader,
  saveAuthToStore,
  getAuthFromStore,
  removeAuthFromStore,
  isTokenExpired,
};
