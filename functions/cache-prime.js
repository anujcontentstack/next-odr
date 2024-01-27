export default async function handler(request, response) {
  const baseURL = "https://next-odr.devcontentstackapps.com"

  const paths = ["/blog/data-mining-and-its-significance-in-business-analytics"];

  const someResponse = await fetch(`${baseURL}${path}`)
  console.log(someResponse.status());

  console.log(responses.map((response) => response.status()));
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}


