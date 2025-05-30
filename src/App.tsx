import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Redirect } from "wouter";
import Widget from "./pages/Widget";
import Admin from "./pages/Admin";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminCampaign from "./pages/AdminCampaign";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Route path="/" component={() => <Redirect to="/widget" />} />
      <Route path="/widget" component={Widget} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/campaign/:id" component={AdminCampaign} />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
