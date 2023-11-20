export default function handler(_, res) {
  
  res
    .status(200)
    .json({ buildId: process.env.CONTENTSTACK_LAUNCH_DEPLOYMENT_UID })
}