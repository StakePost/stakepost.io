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

export { isBrowser, truncateAddress, delIPFSPrefix, addIPFSPrefix };
