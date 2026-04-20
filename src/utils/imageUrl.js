import { backendUrl } from "./constants";

export const getImageUrl = imageId => (imageId ? `${backendUrl}/image/${imageId}` : null);
