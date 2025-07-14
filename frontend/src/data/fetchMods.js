// fetchMods.js
import user1Mods from './user1/mockMods';
// import user2Mods from './user2/mockMods'; // future

export async function fetchMods(user = 'user1') {
  // In future, replace with real API call, e.g.:
  // return axios.get(`/api/users/${user}/mods`).then(res => res.data);

  switch (user) {
    case 'user1':
      return Promise.resolve(user1Mods);
    // case 'user2':
    //   return Promise.resolve(user2Mods);
    default:
      return Promise.resolve([]);
  }
}
