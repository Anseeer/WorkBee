export const getProfileImage = (
  name?: string,
  image?: string | File | null
): string => {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  if (typeof image === "string" && image.trim() !== "") {
    return image;
  }

  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "W";

  return `https://ui-avatars.com/api/?name=${initials}&background=random`;
};
