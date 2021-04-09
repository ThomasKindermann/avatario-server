// avatar list
let avatars = [];

// add new Avatar to avatar list
const addAvatar = ({ id, name, color, x, y }) => {
  name = name.trim().toLowerCase();

  // pushing new avatar in list
  const avatar = { id, name, color, x, y };
  avatars.push(avatar);
};

// remove avatar from list
const removeAvatar = (id) => {
  const index = avatars.findIndex((avatar) => avatar.id === id);
  if (index !== -1) {
    return avatars.splice(index, 1)[0];
  }
};

// find specific avatar from list
const getAvatar = (id) => avatars.find((avatar) => avatar.id === id);

// mutate avatar position
const updateAvatar = (id, x, y) => {
  const updatedAvatars = avatars.map((avatar) => {
    if (avatar.id === id) {
      avatar.x = x;
      avatar.y = y;
    }
    return avatar;
  });
  avatars = updatedAvatars;
};

// get all avatars
const getAvatars = () => avatars;

module.exports = {
  addAvatar,
  removeAvatar,
  getAvatars,
  getAvatar,
  updateAvatar,
};
