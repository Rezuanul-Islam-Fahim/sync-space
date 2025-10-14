import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home'

function Root() {
  return (
    <div>
      <h1>Hello World</h1>
      <Home/>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
    </BrowserRouter>
  );
}
