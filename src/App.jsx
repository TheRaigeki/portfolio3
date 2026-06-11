import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Stack,
  Works,
} from "./components";

const App = () => {
  return (
    <div className="relative z-0">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Works />
      <Stack />
      <Contact />
      <footer className="footer">© 2026 Robin · raigeki.dev</footer>
    </div>
  );
};

export default App;
