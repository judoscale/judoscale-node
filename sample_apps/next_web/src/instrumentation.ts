export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("-->> NEXT RUNTIME NODEJS")
    const judoscaleModule = await import("./judoscale");
    judoscaleModule.runJudoscaleWorkerAutoscaler();
  }

  if (process.env.NEXT_RUNTIME === "edge") {
  }
}
