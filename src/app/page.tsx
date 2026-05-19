import Hero from "@/components/landing/hero"
import Navbar from "@/components/landing/navbar"

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  )
}
export default LandingPage