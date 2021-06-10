// Copyright (c) 2009-2018 The Bitcoin Core developers
// Copyright (c) 2017 The Zcash developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <key.h>

#include <arith_uint256.h>
#include <crypto/common.h>
#include <crypto/hmac_sha512.h>
#include <random.h>
#include "ecwrapper.h"

/** These functions are taken from the libsecp256k1 distribution and are very ugly. */

/**
 * This parses a format loosely based on a DER encoding of the ECPrivateKey type from
 * section C.4 of SEC 1 <http://www.secg.org/sec1-v2.pdf>, with the following caveats:
 *
 * * The octet-length of the SEQUENCE must be encoded as 1 or 2 octets. It is not
 *   required to be encoded as one octet if it is less than 256, as DER would require.
 * * The octet-length of the SEQUENCE must not be greater than the remaining
 *   length of the key encoding, but need not match it (i.e. the encoding may contain
 *   junk after the encoded SEQUENCE).
 * * The privateKey OCTET STRING is zero-filled on the left to 32 octets.
 * * Anything after the encoding of the privateKey OCTET STRING is ignored, whether
 *   or not it is validly encoded DER.
 *
 * out32 must point to an output buffer of length at least 32 bytes.
 */


/**
 * This serializes to a DER encoding of the ECPrivateKey type from section C.4 of SEC 1
 * <http://www.secg.org/sec1-v2.pdf>. The optional parameters and publicKey fields are
 * included.
 *
 * privkey must point to an output buffer of length at least CKey::PRIVATE_KEY_SIZE bytes.
 * privkeylen must initially be set to the size of the privkey buffer. Upon return it
 * will be set to the number of bytes used in the buffer.
 * key32 must point to a 32-byte raw private key.
 */
namespace {

    int CompareBigEndian(const unsigned char *c1, size_t c1len, const unsigned char *c2, size_t c2len) {
        while (c1len > c2len) {
            if (*c1)
                return 1;
            c1++;
            c1len--;
        }
        while (c2len > c1len) {
            if (*c2)
                return -1;
            c2++;
            c2len--;
        }
        while (c1len > 0) {
            if (*c1 > *c2)
                return 1;
            if (*c2 > *c1)
                return -1;
            c1++;
            c2++;
            c1len--;
        }
        return 0;
    }

/** Order of secp256k1's generator minus 1. */
    const unsigned char vchMaxModOrder[32] = {
            0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
            0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFE,
            0xBA,0xAE,0xDC,0xE6,0xAF,0x48,0xA0,0x3B,
            0xBF,0xD2,0x5E,0x8C,0xD0,0x36,0x41,0x40
    };

/** Half of the order of secp256k1's generator minus 1. */
    const unsigned char vchMaxModHalfOrder[32] = {
            0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
            0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
            0x5D,0x57,0x6E,0x73,0x57,0xA4,0x50,0x1D,
            0xDF,0xE9,0x2F,0x46,0x68,0x1B,0x20,0xA0
    };

    const unsigned char vchZero[1] = {0};

}

bool CKey::Check(const unsigned char *vch) {
    return CompareBigEndian(vch, 32, vchZero, 0) > 0 &&
           CompareBigEndian(vch, 32, vchMaxModOrder, 32) <= 0;
}
//bool CKey::CheckSignatureElement(const unsigned char *vch, int len, bool half) {
//    return CompareBigEndian(vch, len, vchZero, 0) > 0 &&
//           CompareBigEndian(vch, len, half ? vchMaxModHalfOrder : vchMaxModOrder, 32) <= 0;
//}
void CKey::MakeNewKey(bool fCompressedIn) {
    do {
        GetStrongRandBytes(keydata.data(), keydata.size());
    } while (!Check(keydata.data()));
    fValid = true;
    fCompressed = fCompressedIn;
}

CPrivKey CKey::GetPrivKey() const {
    assert(fValid);
    CPrivKey privkey;
    int privkeylen, ret;
    CECKey key;
    key.SetSecretBytes(keydata.data());
    privkeylen = key.GetPrivKeySize(fCompressed);
    assert(privkeylen);
    privkey.resize(privkeylen);
    ret = key.GetPrivKey(&privkey[0], fCompressed);
    assert(ret == (int)privkey.size());
    return privkey;
}

CPubKey CKey::GetPubKey() const {
    assert(fValid);
    CPubKey result;
    std::vector<unsigned char> pubkey;
    CECKey key;
    key.SetSecretBytes(keydata.data());
    key.GetPubKey(pubkey, fCompressed);
    result.Set(pubkey.begin(), pubkey.end());
    assert(result.IsValid());
    return result;
}

// Check that the sig has a low R value and will be less than 71 bytes
//bool SigHasLowR(const secp256k1_ecdsa_signature* sig)
//{
//    unsigned char compact_sig[64];
//    secp256k1_ecdsa_signature_serialize_compact(secp256k1_context_sign, compact_sig, sig);
//
//    // In DER serialization, all values are interpreted as big-endian, signed integers. The highest bit in the integer indicates
//    // its signed-ness; 0 is positive, 1 is negative. When the value is interpreted as a negative integer, it must be converted
//    // to a positive value by prepending a 0x00 byte so that the highest bit is 0. We can avoid this prepending by ensuring that
//    // our highest bit is always 0, and thus we must check that the first byte is less than 0x80.
//    return compact_sig[0] < 0x80;
//}

bool CKey::Sign(const uint256 &hash, std::vector<unsigned char>& vchSig, bool grind, uint32_t test_case) const {
    if (!fValid)
        return false;
    CECKey key;
    key.SetSecretBytes(keydata.data());
    return key.Sign(hash, vchSig, grind);
}

bool CKey::VerifyPubKey(const CPubKey& pubkey) const {
    if (pubkey.IsCompressed() != fCompressed) {
        return false;
    }
    unsigned char rnd[8];
    std::string str = "Bitcoin key verification\n";
    GetRandBytes(rnd, sizeof(rnd));
    uint256 hash;
    CHash256().Write((unsigned char*)str.data(), str.size()).Write(rnd, sizeof(rnd)).Finalize(hash.begin());
    std::vector<unsigned char> vchSig;
    Sign(hash, vchSig);
    return pubkey.Verify(hash, vchSig);
}

bool CKey::SignCompact(const uint256 &hash, std::vector<unsigned char>& vchSig) const {
    if (!fValid)
        return false;
    vchSig.resize(CPubKey::COMPACT_SIGNATURE_SIZE);
    int rec = -1;
    CECKey key;
    key.SetSecretBytes(keydata.data());
    if (!key.SignCompact(hash, &vchSig[1], rec))
        return false;
    assert(rec != -1);
    vchSig[0] = 27 + rec + (fCompressed ? 4 : 0);
    return true;
}

bool CKey::Load(const CPrivKey &privkey, const CPubKey &vchPubKey, bool fSkipCheck=false) {
    CECKey key;
    if (!key.SetPrivKey(&privkey[0], privkey.size(), fSkipCheck))
        return false;
    key.GetSecretBytes(keydata.data());
    fCompressed = vchPubKey.IsCompressed();
    fValid = true;

    if (fSkipCheck)
        return true;
    if (GetPubKey() != vchPubKey)
        return false;

    return true;
}



//bool CPubKey::Decompress() {
//    if (!IsValid())
//        return false;
//    CECKey key;
//    if (!key.SetPubKey(begin(), size()))
//        return false;
//    std::vector<unsigned char> pubkey;
//    key.GetPubKey(pubkey, false);
//    Set(pubkey.begin(), pubkey.end());
//    return true;
//}

void static BIP32Hash(const unsigned char chainCode[32], unsigned int nChild, unsigned char header, const unsigned char data[32], unsigned char output[64]) {
    unsigned char num[4];
    num[0] = (nChild >> 24) & 0xFF;
    num[1] = (nChild >> 16) & 0xFF;
    num[2] = (nChild >>  8) & 0xFF;
    num[3] = (nChild >>  0) & 0xFF;
    CHMAC_SHA512(chainCode, 32).Write(&header, 1)
            .Write(data, 32)
            .Write(num, 4)
            .Finalize(output);
}


bool CKey::Derive(CKey& keyChild, ChainCode &ccChild, unsigned int nChild, const ChainCode& cc) const {
    assert(IsValid());
    assert(IsCompressed());
    std::vector<unsigned char, secure_allocator<unsigned char>> vout(64);
    if ((nChild >> 31) == 0) {
        CPubKey pubkey = GetPubKey();
        assert(pubkey.size() == CPubKey::COMPRESSED_PUBLIC_KEY_SIZE);
        BIP32Hash(cc, nChild, *pubkey.begin(), pubkey.begin()+1, vout.data());
    } else {
        assert(size() == 32);
        BIP32Hash(cc, nChild, 0, begin(), vout.data());
    }
    memcpy(ccChild.begin(), vout.data()+32, 32);
    bool ret = CECKey::TweakSecret((unsigned char*)keyChild.begin(), begin(), vout.data());
    keyChild.fCompressed = true;
    keyChild.fValid = ret;
    return ret;
}

bool CExtKey::Derive(CExtKey &out, unsigned int _nChild) const {
    out.nDepth = nDepth + 1;
    CKeyID id = key.GetPubKey().GetID();
    memcpy(&out.vchFingerprint[0], &id, 4);
    out.nChild = _nChild;
    return key.Derive(out.key, out.chaincode, _nChild, chaincode);
}

void CExtKey::SetSeed(const unsigned char *seed, unsigned int nSeedLen) {
    static const unsigned char hashkey[] = {'B','i','t','c','o','i','n',' ','s','e','e','d'};
    std::vector<unsigned char, secure_allocator<unsigned char>> vout(64);
    CHMAC_SHA512(hashkey, sizeof(hashkey)).Write(seed, nSeedLen).Finalize(vout.data());
    key.Set(vout.data(), vout.data() + 32, true);
    memcpy(chaincode.begin(), vout.data() + 32, 32);
    nDepth = 0;
    nChild = 0;
    memset(vchFingerprint, 0, sizeof(vchFingerprint));
}

CExtPubKey CExtKey::Neuter() const {
    CExtPubKey ret;
    ret.nDepth = nDepth;
    memcpy(&ret.vchFingerprint[0], &vchFingerprint[0], 4);
    ret.nChild = nChild;
    ret.pubkey = key.GetPubKey();
    ret.chaincode = chaincode;
    return ret;
}

void CExtKey::Encode(unsigned char code[BIP32_EXTKEY_SIZE]) const {
    code[0] = nDepth;
    memcpy(code+1, vchFingerprint, 4);
    code[5] = (nChild >> 24) & 0xFF; code[6] = (nChild >> 16) & 0xFF;
    code[7] = (nChild >>  8) & 0xFF; code[8] = (nChild >>  0) & 0xFF;
    memcpy(code+9, chaincode.begin(), 32);
    code[41] = 0;
    assert(key.size() == 32);
    memcpy(code+42, key.begin(), 32);
}

void CExtKey::Decode(const unsigned char code[BIP32_EXTKEY_SIZE]) {
    nDepth = code[0];
    memcpy(vchFingerprint, code+1, 4);
    nChild = (code[5] << 24) | (code[6] << 16) | (code[7] << 8) | code[8];
    memcpy(chaincode.begin(), code+9, 32);
    key.Set(code+42, code+74, true);
}

bool ECC_InitSanityCheck() {
    return CECKey::SanityCheck();
}




