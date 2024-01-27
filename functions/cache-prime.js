export default async function handler(request, response) {
  const baseURL = "https://next-odr.devcontentstackapps.com"

  const paths = ["/blog/data-mining-and-its-significance-in-business-analytics"];

  const responses = await Promise.all(paths.map(async (path) => {
    const response = await fetch(`${baseURL}${path}`)
    return response
  }));

  console.log(responses.map((response) => response.status()));
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}


