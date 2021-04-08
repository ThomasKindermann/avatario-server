const avatars = [];

const addAvatar = ({ id, name, color, x, y }) => {
  name = name.trim().toLowerCase();

  const existingAvatar = avatars.find((avatar) => avatar.name === name);

  if (existingAvatar) {
    return { error: "Username is taken" };
  }
  const avatar = { id, name, color, x, y };
  avatars.push(avatar);

  return { avatar };
};

const removeAvatar = (id) => {
  const index = avatars.findIndex((avatar) => avatar.id === id);
  if (index !== -1) {
    return avatars.splice(index, 1)[0];
  }
};

const getAvatars = () => avatars;

module.exports = { addAvatar, removeAvatar, getAvatars };
