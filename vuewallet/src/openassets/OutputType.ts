const UNCOLORED = 0;
const MARKER_OUTPUT = 1;
const ISSUANCE = 2;
const TRANSFER = 3;

function reverseMap (value:number) {
    switch (value) {
        case UNCOLORED:     return "UNCOLORED";
        case MARKER_OUTPUT: return "MARKER_OUTPUT";
        case ISSUANCE:      return "ISSUANCE";
        case TRANSFER:      return "TRANSFER";
        default:            return "Unknown";
    }
}

// The public API for this object
export {UNCOLORED ,MARKER_OUTPUT,ISSUANCE,TRANSFER,reverseMap}