export async function registerUser(username: string, password: string) {
  const res = await fetch("http://127.0.0.1:8000/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch("http://127.0.0.1:8000/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();
  if (res.ok && data.access_token) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

export async function uploadResume(file: File) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/upload_resume/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return await res.json();
}

export async function getMyRoadmaps() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://127.0.0.1:8000/my_roadmaps/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
