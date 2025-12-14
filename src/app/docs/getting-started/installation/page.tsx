export const metadata = {
  title: "Installation",
  description: "How to install the XXML compiler",
};

export default function InstallationPage() {
  return (
    <>
      <h1>Installation</h1>
      <p className="lead">
        Get the XXML compiler set up on your system and start building applications.
      </p>

      <h2>Requirements</h2>
      <ul>
        <li>C++20 compatible compiler (GCC 10+, Clang 10+, MSVC 2019+)</li>
        <li>CMake 3.20+</li>
        <li>LLVM (for code generation)</li>
      </ul>

      <h2>Building from Source</h2>
      <p>Clone the repository and build using CMake:</p>
      <pre>
        <code>{`git clone https://github.com/ThatSoulyGuy/XXMLCompiler.git
cd XXMLCompiler
cmake --preset x64-release
cmake --build --preset x64-release`}</code>
      </pre>

      <h2>Verifying Installation</h2>
      <p>After building, verify the installation by checking the version:</p>
      <pre>
        <code>{`xxml --version`}</code>
      </pre>

      <h2>Compiling Your First Program</h2>
      <p>
        Create a file called <code>hello.xxml</code> and compile it:
      </p>
      <pre>
        <code>{`xxml hello.xxml hello.exe`}</code>
      </pre>

      <h2>Next Steps</h2>
      <p>
        Now that you have XXML installed, continue to the{" "}
        <a href="/docs/getting-started/hello-world">Hello World tutorial</a> to write
        your first XXML program.
      </p>
    </>
  );
}
