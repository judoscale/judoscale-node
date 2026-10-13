/*
  Runs `callback` once when the response is done, whether it completed normally
  (`finish`) or the connection closed early (`close` without `finish`).

  Express/Next instrumentation previously only listened for `finish`. Aborted
  clients often never emit `finish`, which leaked the utilization request
  counter and pegged utilization at 100% until process restart.
*/
function onResponseSettled(res, callback) {
  let settled = false

  const settle = (reason) => {
    if (settled) return
    settled = true
    callback(reason)
  }

  res.on('finish', () => settle('finish'))
  res.on('close', () => settle('close'))
}

module.exports = onResponseSettled
