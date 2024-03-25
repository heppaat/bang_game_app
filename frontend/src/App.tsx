import { useState } from "react";
import { signup, login } from "./api";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);

  const handleSignup = async () => {
    const response = await signup(username, password);
    setSuccess(response.success);
  };

  const handleLogin = async () => {
    const response = await login(loginName, loginPassword);
    setLoginSuccess(response.success);
  };

  return (
    <main className="flex flex-col items-center py-16">
      <h1>REGISTER</h1>
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
          type="password"
          placeholder="Password"
        />
        <button onClick={handleSignup} className="btn btn-success">
          SIGNUP
        </button>
        <button onClick={handleLogin} className="btn btn-success">
          LOGIN
        </button>
      </section>
      {success === true && (
        <section className="alert alert-success max-w-[300px] flex justify-between">
          Success!!!
          <button onClick={() => setSuccess(null)} className="btn btn-ghost">
            Close
          </button>
        </section>
      )}
      {success === false && (
        <section className="alert alert-error max-w-[300px] flex justify-between">
          Error!!!
          <button onClick={() => setSuccess(null)} className="btn btn-ghost">
            Close
          </button>
        </section>
      )}
    </main>
  );
};

export default App;
