import React, { useEffect, useState } from "react";
import "./App.css";

function App() {

  const API_URL =
    "https://salesforce-validation-manager-a5h6.onrender.com";

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {

    try {

      const response = await fetch(
        `${API_URL}/user`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.loggedIn) {
        setLoggedIn(true);
        setUsername(data.username);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const login = () => {

    window.open(
      `${API_URL}/login`,
      "_self"
    );
  };

  const logout = async () => {

    await fetch(
      `${API_URL}/logout`,
      {
        credentials: "include",
      }
    );

    setLoggedIn(false);
    setUsername("");
    setRules([]);
    setSuccessMessage("");
  };

  const getMetadata = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/validation-rules`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setRules(data);

      setLoading(false);

    } catch (err) {

      console.log(err);

      setLoading(false);
    }
  };

  const toggleRule = (index) => {

    const updatedRules = [...rules];

    updatedRules[index].active =
      !updatedRules[index].active;

    setRules(updatedRules);
  };

  const enableAll = () => {

    const updated = rules.map((rule) => ({
      ...rule,
      active: true,
    }));

    setRules(updated);
  };

  const disableAll = () => {

    const updated = rules.map((rule) => ({
      ...rule,
      active: false,
    }));

    setRules(updated);
  };

  const rollbackChanges = async () => {

    try {

      const response = await fetch(
        `${API_URL}/rollback`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setRules(data);

      setSuccessMessage(
        "Rollback completed successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {

      console.log(err);
    }
  };

  const deployChanges = async () => {

    try {

      setDeploying(true);

      await fetch(
        `${API_URL}/deploy`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            rules,
          }),
        }
      );

      setDeploying(false);

      setSuccessMessage(
        "Changes deployed successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {

      console.log(err);

      setDeploying(false);
    }
  };

  return (

    <div className="container">

      <h1>
        Salesforce Validation Rule Manager
      </h1>

      {!loggedIn ? (

        <button
          className="loginButton"
          onClick={login}
        >
          Login with OAuth 2.0
        </button>

      ) : (

        <>

          {rules.length === 0 && (

            <>

              <div className="userBox">

                <p>
                  <strong>Username:</strong>{" "}
                  {username}
                </p>

                <p>
                  <strong>Organization:</strong>{" "}
                  Test
                </p>

              </div>

              <div className="buttonGroup">

                <button
                  className="logoutButton"
                  onClick={logout}
                >
                  Logout
                </button>

                <button
                  className="metadataButton"
                  onClick={getMetadata}
                >
                  Get Metadata
                </button>

              </div>

              {loading && (

                <div className="loadingText">
                  Fetching validation rules...
                </div>
              )}

            </>
          )}

          {rules.length > 0 && (

            <>

              <div className="metadataHeaderCentered">

                <h2>{username}</h2>

                <div className="centerButtons">

                  <button
                    className="rollbackButton"
                    onClick={rollbackChanges}
                  >
                    Rollback to Original
                  </button>

                  <button
                    className="deployButton"
                    onClick={deployChanges}
                    disabled={deploying}
                  >

                    {deploying
                      ? "Deploying..."
                      : "Deploy Changes"}

                  </button>

                </div>

              </div>

              {successMessage && (

                <div className="successBox">
                  {successMessage}
                </div>
              )}

              <div className="topButtons">

                <button
                  className="enableButton"
                  onClick={enableAll}
                >
                  Enable All
                </button>

                <button
                  className="disableButton"
                  onClick={disableAll}
                >
                  Disable All
                </button>

              </div>

              <table>

                <thead>

                  <tr>

                    <th>
                      Validation Rule
                    </th>

                    <th>
                      Object
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Toggle
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {rules.map(
                    (rule, index) => (

                      <tr key={rule.id}>

                        <td>
                          {rule.name}
                        </td>

                        <td>
                          {rule.object}
                        </td>

                        <td>

                          {rule.active
                            ? "Active"
                            : "Inactive"}

                        </td>

                        <td>

                          <label className="switch">

                            <input
                              type="checkbox"
                              checked={
                                rule.active
                              }
                              onChange={() =>
                                toggleRule(index)
                              }
                            />

                            <span className="slider round"></span>

                          </label>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </>
          )}

        </>
      )}

    </div>
  );
}

export default App;

