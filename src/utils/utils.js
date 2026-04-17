function formatINR(amount) {
    return amount.toLocaleString('en-IN');
}

function normalizeRecords(records, options = {}){
    // options: { groupId, groupName }
    if(!Array.isArray(records)) return [];
    const gid = options.groupId != null ? String(options.groupId) : null;
    const gname = options.groupName ? String(options.groupName).toLowerCase() : null;
    const map = new Map();
    records.forEach(r=>{
        if(!r) return;
        const rec = { ...r };
        // keep id; if missing generate deterministic id from other fields
        rec.id = rec.id || rec._id || rec.invoiceNo || rec.expenseNo || ('gen_' + (rec.createdAt || rec.createdOn || Math.random()).toString());
        // normalize group id/name to string
        const recGid = (rec.groupId != null) ? String(rec.groupId) : null;
        const recGname = (rec.groupName || rec.group || rec.group_name) ? String(rec.groupName || rec.group || rec.group_name).toLowerCase() : null;

        // if caller requested a group filter, enforce it
        if(gid){
            if(recGid){
                if(String(recGid) !== String(gid)) return; // different groupId
            } else if(gname){
                // if record lacks groupId but has groupName, compare to caller's groupName
                if(!recGname || recGname !== gname) return;
            } else {
                // no rec group info available -> skip to avoid mixing groups
                return;
            }
        }

        // normalize amount -> number
        rec.amount = Number(String(rec.amount || '0').replace(/,/g,'')) || 0;
        // normalize isPending to boolean
        rec.isPending = (rec.isPending === true) || (String(rec.isPending).toLowerCase() === 'true') || (String(rec.isPending).toLowerCase() === '1');
        // normalize status
        rec.status = rec.status || 'ACTIVE';
        // ensure contact/name fields exist
        rec.contributerName = rec.contributerName || rec.contributorName || rec.name || '';
        // dedupe by id (server id preferred)
        map.set(String(rec.id), rec);
    })
    return Array.from(map.values());
}

module.exports = {
    formatINR: formatINR
    , normalizeRecords
};