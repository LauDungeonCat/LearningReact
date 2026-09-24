import GeneradorEncuentros from "./proyectos/generador_encuentros/GeneradorEncuentros";
import Header from "./components/header";
import Footer from "./components/footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <GeneradorEncuentros />
      </main>
      <Footer />
    </>
  );
}