import { Routes, Route } from 'react-router-dom'
import BlogList from './ui/pages/BlogList'
import BlogDetail from './ui/pages/BlogDetail'

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Blog Dashboard</h1>
        <span className="header-badge">READ-ONLY</span>
      </header>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
      </Routes>
    </div>
  )
}

export default App
