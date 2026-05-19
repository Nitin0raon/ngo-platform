import Navbar from '../components/Navbar'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
