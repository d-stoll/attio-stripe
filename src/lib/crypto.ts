import CryptoJS from "crypto-js"

export function timingSafeEqual(a: string, b: string): boolean {
    const waA = CryptoJS.enc.Utf8.parse(a)
    const waB = CryptoJS.enc.Utf8.parse(b)

    const lenA = waA.sigBytes
    const lenB = waB.sigBytes

    const waB_safe = lenA === lenB ? waB : waA

    let diff = 0

    const nWords = Math.ceil(lenA / 4)

    for (let i = 0; i < nWords; i++) {
        diff |= waA.words[i] ^ waB_safe.words[i]
    }

    return lenA === lenB && diff === 0
}
