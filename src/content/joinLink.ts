// The WhatsApp invite is deliberately not a literal anywhere in the source, so
// it cannot appear in the prerendered HTML or in the JS bundle. Link harvesters
// scanning for /chat\.whatsapp\.com\/[A-Za-z0-9]+/ find nothing, and with no
// href to crawl, search engines never index the invite either.
//
// This is obfuscation, not security: anyone who opens devtools and clicks the
// button reads the URL straight off the anchor. It removes the link from the
// machine-readable surface of the public web, and nothing more.
//
// Split across three chunks so that decoding every base64-looking blob in the
// bundle is not enough on its own.
//
// To rotate the invite after resetting the group link in WhatsApp, run:
//   node -e 'const u="<new url>",b=Buffer.from(u).toString("base64"),n=Math.ceil(b.length/3);console.log(JSON.stringify([b.slice(0,n),b.slice(n,2*n),b.slice(2*n)]))'
const parts = ["aHR0cHM6Ly9jaGF0LndoYX", "RzYXBwLmNvbS9ET0d5TnJj", "ZFNUREFrZGxaYzZBdjNy"];

/**
 * Call this from an event handler only. Calling it during render would bake the
 * result into the prerendered HTML and undo the entire point.
 */
export function inviteUrl() {
  return atob(parts.join(""));
}
