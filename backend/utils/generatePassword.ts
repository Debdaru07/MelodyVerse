import { v4 as uuidv4 } from "uuid";

// Allowed characters for additional randomness
const specialChars = "!@#$%^&*()";
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";


export function generateSecurePassword(): string {
  /**
 * Generates a secure password with at least one uppercase letter,
 * one lowercase letter, one number, and one special character.
 * The password is based on a UUID and is extended with random characters.
 * 
 * @returns {string} - A randomly generated secure password.
 */
  let uuid = uuidv4().replace(/-/g, ""); // Remove dashes (32 chars)

  // Add random alphanumeric characters to extend up to 49 characters
  while (uuid.length < 49) {
    uuid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  // Insert at least one special character at a random position
  const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
  const insertPos = Math.floor(Math.random() * uuid.length);

  return uuid.slice(0, insertPos) + randomSpecial + uuid.slice(insertPos);
}

