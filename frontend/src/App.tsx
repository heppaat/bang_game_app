import { useState } from "react";
import { signup, login, createGame } from "./api";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState<boolean | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(
    localStorage.getItem("token") ? true : null
  );

  const handleSignup = async () => {
    const response = await signup(username, password);
    setSignupSuccess(response.success);
  };

  const handleLogin = async () => {
    const response = await login(username, password);
    setLoginSuccess(response.success);
    if (response.success) {
      setPassword("");
      setUsername("");
      localStorage.setItem("token", response.data.token);
      //const token = localStorage.getItem("token")
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoginSuccess(null);
  };

  const handleCreate = async () => {
    const response = await createGame();
    console.log(response);
  };

  return (
    <>
      {loginSuccess !== true && (
        <main className="flex flex-col items-center py-16">
          <section className="card card-body max-w-[300px] bg-primary text-primary-content mb-8">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered"
              type="text"
              placeholder="Name"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              type="text"
              placeholder="Password"
            />
            <button onClick={handleSignup} className="btn btn-success">
              SIGNUP
            </button>
            <button onClick={handleLogin} className="btn btn-success">
              LOGIN
            </button>
          </section>
          {signupSuccess === true && (
            <section className="alert alert-success max-w-[300px] flex justify-between">
              Success!!!
              <button
                onClick={() => setSignupSuccess(null)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </section>
          )}
          {signupSuccess === false && (
            <section className="alert alert-error max-w-[300px] flex justify-between">
              Error!!!
              <button
                onClick={() => setSignupSuccess(null)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </section>
          )}

          {loginSuccess === false && (
            <section className="alert alert-error max-w-[300px] flex justify-between">
              Error!!!
              <button
                onClick={() => setLoginSuccess(null)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </section>
          )}
        </main>
      )}

      <main className="flex flex-col items-center py-16">
        {loginSuccess === true && (
          <section className="alert alert-success max-w-[300px] flex justify-between">
            You are logged in!!!
            <button onClick={handleCreate} className="btn btn-ghost">
              Create Demo
            </button>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </section>
        )}
      </main>
    </>
  );
};

export default App;
