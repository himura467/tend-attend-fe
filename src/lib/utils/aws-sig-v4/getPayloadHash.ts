import { UNSIGNED_PAYLOAD } from "./constants";

const isArrayBuffer = (arg: unknown): arg is ArrayBuffer => {
  return (
    (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === "[object ArrayBuffer]"
  );
};

const toUint8Array = (data: string | ArrayBuffer | ArrayBufferView): Uint8Array => {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  } else if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};

export const getPayloadHash = async (
  body: string | ArrayBuffer | ArrayBufferView | FormData | URLSearchParams | Blob | undefined,
): Promise<string> => {
  // Empty body hash (SHA-256 of empty string)
  if (body === undefined) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  }
  if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hash = await crypto.subtle.digest("SHA-256", toUint8Array(body));
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
  }
  // As any defined body that is not a string or binary data is a stream, this body is unsignable.
  // Attempt to send the request with an unsigned payload, which may or may not be accepted by the service.
  return UNSIGNED_PAYLOAD;
};
