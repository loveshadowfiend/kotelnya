export async function registerUser(userJSON: string) {
  const response = await fetch("http://103.249.132.70:9001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userJSON,
  });

  return response;
}
