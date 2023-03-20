/**
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
export function fromHexString(hexString: string): ArrayBuffer {
  return new Uint8Array((hexString.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16))).buffer;
}

/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
export function toHexString(bytes: ArrayBuffer): string {
  return new Uint8Array(bytes).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function isDelegationValid(chain: any) {
  // Verify that the no delegation is expired. If any are in the chain, returns false.
  if (!chain || !chain?.delegations) {
    return false;
  }

  for (const { delegation } of chain.delegations) {
    // prettier-ignore
    if (parseInt(delegation.expiration, 16) / 1e6 <= +Date.now()) {
      return false;
    }
  }

  return true;
}
