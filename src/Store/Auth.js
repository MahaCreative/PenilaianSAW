import { atom } from "recoil";
const authenticated = atom({
  key: "authenticated",
  default: {
    check: false,
    user: [],
  },
});
const tokenUser = atom({
  key: "tokenUser",
  default: null,
});
export { authenticated, tokenUser };
