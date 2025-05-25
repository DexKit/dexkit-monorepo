import { ShareType } from "./types";

export function generateShareLink(
  text: string,
  url: string,
  type: ShareType
): string {
  // Encode URL and text for safe sharing
  const encodedText = encodeURIComponent(text);
  const encodedURL = encodeURIComponent(url);

  switch (type) {
    case "telegram":
      return `https://t.me/share/url?url=${encodedURL}&text=${encodedText}`;

    case "whatsapp":
      return `https://wa.me/?text=${encodedText}`;

    case "pinterest":
      // Replace the `media` placeholder with the desired image URL if applicable
      const imageURL = "https://example.com/image.jpg";
      return `https://pinterest.com/pin/create/button/?url=${encodedURL}&media=${encodeURIComponent(
        imageURL
      )}&description=${encodedText}`;

    case "email":
      return `mailto:?body=${encodedText}`;

    case "link":
      return url;

    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&quote=${encodedText}`;

    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedText}`;

    default:
      throw new Error("Unsupported share type");
  }
}
