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

  const hash = name
    ? Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;

  const color = ((hash * 1234567) % 0xffffff).toString(16).padStart(6, '0');

  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=ffffff`;
};
