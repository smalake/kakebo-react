import { atom } from 'recoil';

export const parentFlagAtom = atom({
  key: 'ParentFlagAtom',
  default: -1,
});

// indexedDBの値を変換
// export const parentFlagSelector = selector({
//   key: 'ParentFlagSelector',
//   get: async ({ get }) => {
//     const flag = get(parentFlagAtom);
//     if (flag === -1) {
//       try {
//         const res = await settingApi.isParent();
//         if (res.status === 200) {
//           if (res.data.admin) {
//             return 1;
//           } else {
//             return 0;
//           }
//         } else if (res.status === 401) {
//           return 401;
//         } else {
//           console.log(res);
//           return -1;
//         }
//       } catch (err) {
//         console.log(err);
//         return -1;
//       }
//     } else {
//       return flag;
//     }
//   },
//   set: ({ set }, newValue: number | undefined | DefaultValue) => set(parentFlagAtom, newValue!),
// });
