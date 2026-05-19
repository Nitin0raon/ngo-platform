import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <Navbar />

      {/* HERO */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-[#eaf3ea] to-[#fdfcf8]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <p className="text-green-700 font-medium mb-4 tracking-wide">
              Empowering communities
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Together we can create
              <span className="block text-green-700">real change</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Join a network of passionate volunteers and trusted NGOs working
              together to build a better world.
            </p>

            <div className="flex gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/programs"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Explore Programs
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1593113630400-ea4288922497"
              alt="Volunteers helping"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['200+', 'NGOs'],
            ['5000+', 'Volunteers'],
            ['1200+', 'Programs'],
            ['50+', 'Cities'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-bold text-green-700">{v}</div>
              <div className="text-gray-500 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-[#fdfcf8]">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Designed for impact
            </h2>
            <p className="text-gray-500">
              Everything you need to connect, contribute, and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['Discover Programs', 'Browse verified NGOs and find meaningful opportunities.'],
              ['Seamless Joining', 'Join programs instantly with a smooth experience.'],
              ['Track Progress', 'Monitor your contributions and achievements easily.'],
            ].map(([title, desc]) => (
              <div key={title} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMAGE + TEXT SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4">

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your actions matter
            </h2>
            <p className="text-gray-600 mb-6">
              Whether it's helping communities, educating children, or protecting nature —
              every action contributes to a better future.
            </p>

            <Link
              to="/signup"
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Join the movement
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"
              alt="Helping community"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#f4f7f4]">
        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            What people say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              'Volunect helped me find meaningful opportunities quickly.',
              'Managing volunteers has never been this easy.',
              'A platform that truly makes a difference.',
            ].map((quote, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-sm italic">"{quote}"</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">
            Ready to make a difference?
          </h2>
          <p className="mb-6 text-green-100">
            Join thousands already contributing to meaningful causes.
          </p>

          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Volunect — Built with purpose
      </footer>
    </div>
  )
}