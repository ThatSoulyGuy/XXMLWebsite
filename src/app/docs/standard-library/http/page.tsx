import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "HTTP",
  description: "HTTP client and server in XXML",
};

function ClassHeader({ name, description }: { name: string; description: string }) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100" id={name.toLowerCase().replace(/\s/g, "-")}>
        {name}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{description}</p>
    </div>
  );
}

function MethodTable({ methods }: { methods: { name: string; params: string; returns: string; desc: string }[] }) {
  return (
    <div className="not-prose my-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Method</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Parameters</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Returns</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {methods.map((m, i) => (
            <tr key={`${m.name}-${i}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{m.name}</td>
              <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">{m.params || "—"}</td>
              <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">{m.returns}</td>
              <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{m.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HTTPPage() {
  return (
    <>
      <h1>HTTP</h1>
      <p className="lead">
        HTTP client and server functionality for web requests. The <code>Network</code> module
        provides <code>HTTPClient</code>, <code>HTTPResponse</code>, and <code>HTTPServer</code> classes.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Network;`}</CodeBlock>

      <Callout type="info">
        HTTP functionality requires C++ runtime backing and may need external libraries
        (e.g., libcurl) for full implementation.
      </Callout>

      <ClassHeader name="HTTPResponse" description="Represents an HTTP response." />

      <h3>Constructor</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "HTTPResponse^", desc: "Create response object" },
        ]}
      />

      <h3>Response Methods</h3>
      <MethodTable
        methods={[
          { name: "getStatusCode", params: "", returns: "Integer^", desc: "Status code (200, 404, etc.)" },
          { name: "getBody", params: "", returns: "String^", desc: "Response content" },
          { name: "isSuccess", params: "", returns: "Bool^", desc: "True for 200-299" },
          { name: "isError", params: "", returns: "Bool^", desc: "True for 400+" },
        ]}
      />

      <CodeBlock language="xxml">{`If (response.isSuccess()) -> {
    Run Console::printLine(String::Constructor("Request succeeded"));
    Run Console::printLine(response.getBody());
}

If (response.isError()) -> {
    Run Console::printError(String::Constructor("Request failed: ").append(response.getStatusCode().toString()));
}`}</CodeBlock>

      <ClassHeader name="HTTPClient" description="HTTP client for making web requests." />

      <h3>Constructor</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "HTTPClient^", desc: "Create HTTP client" },
        ]}
      />

      <h3>Configuration</h3>
      <MethodTable
        methods={[
          { name: "setHeader", params: "key: String^, value: String^", returns: "None", desc: "Set request header" },
          { name: "setTimeout", params: "milliseconds: Integer^", returns: "None", desc: "Set timeout" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate Network::HTTPClient^ As <client> = Network::HTTPClient::Constructor();
Run client.setHeader(String::Constructor("Content-Type"), String::Constructor("application/json"));
Run client.setHeader(String::Constructor("Authorization"), String::Constructor("Bearer token123"));
Run client.setTimeout(Integer::Constructor(5000));  // 5 seconds`}</CodeBlock>

      <h3>HTTP Methods</h3>
      <MethodTable
        methods={[
          { name: "performGet", params: "url: String^", returns: "HTTPResponse^", desc: "GET request" },
          { name: "performPost", params: "url: String^, data: String^", returns: "HTTPResponse^", desc: "POST request" },
        ]}
      />
      <CodeBlock language="xxml">{`// GET request
Instantiate Network::HTTPResponse^ As <response> = client.performGet(
    String::Constructor("https://api.example.com/data")
);

// POST request with JSON body
Instantiate Network::HTTPResponse^ As <postResp> = client.performPost(
    String::Constructor("https://api.example.com/submit"),
    String::Constructor("{\"name\":\"Alice\"}")
);`}</CodeBlock>

      <ClassHeader name="HTTPServer" description="Simple HTTP server (experimental)." />

      <h3>Constructor</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "HTTPServer^", desc: "Create HTTP server" },
        ]}
      />

      <h3>Server Control</h3>
      <MethodTable
        methods={[
          { name: "listen", params: "port: Integer^", returns: "None", desc: "Start listening" },
          { name: "stop", params: "", returns: "None", desc: "Stop server" },
          { name: "isRunning", params: "", returns: "Bool^", desc: "True if running" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate Network::HTTPServer^ As <server> = Network::HTTPServer::Constructor();
Run server.listen(Integer::Constructor(8080));

If (server.isRunning()) -> {
    Run Console::printLine(String::Constructor("Server is running on port 8080"));
}

// Later...
Run server.stop();`}</CodeBlock>

      <h2>Status Code Ranges</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">Range</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">200-299</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Success</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">200 OK, 201 Created</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">300-399</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Redirect</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">301 Moved, 304 Not Modified</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">400-499</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Client Error</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">400 Bad Request, 404 Not Found</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">500-599</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Server Error</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">500 Internal Error, 503 Unavailable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="http_example.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Network;
#import Language::Format;
#import Language::System;

[ Entrypoint
    {
        // Create HTTP client
        Instantiate Network::HTTPClient^ As <client> = Network::HTTPClient::Constructor();

        // Configure client
        Run client.setHeader(String::Constructor("Accept"), String::Constructor("application/json"));
        Run client.setTimeout(Integer::Constructor(10000));  // 10 second timeout

        // Make GET request
        Run Console::printLine(String::Constructor("Making GET request..."));
        Instantiate Network::HTTPResponse^ As <getResp> = client.performGet(
            String::Constructor("https://api.example.com/users/1")
        );

        If (getResp.isSuccess()) -> {
            Run Console::printLine(String::Constructor("GET succeeded"));
            Run Console::printLine(String::Constructor("Body: ").append(getResp.getBody()));
        }

        // Make POST request with JSON
        Instantiate Format::JSONObject^ As <postData> = Format::JSONObject::Constructor();
        Run postData.set(String::Constructor("name"), String::Constructor("Alice"));
        Run postData.set(String::Constructor("email"), String::Constructor("alice@example.com"));

        Run client.setHeader(String::Constructor("Content-Type"), String::Constructor("application/json"));

        Instantiate Network::HTTPResponse^ As <postResp> = client.performPost(
            String::Constructor("https://api.example.com/users"),
            postData.stringify()
        );

        If (postResp.isSuccess()) -> {
            Run Console::printLine(String::Constructor("POST succeeded"));
            Run Console::printLine(String::Constructor("Status: ").append(postResp.getStatusCode().toString()));
        }

        If (postResp.isError()) -> {
            Run Console::printError(String::Constructor("POST failed with status: ").append(postResp.getStatusCode().toString()));
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/json" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          JSON
        </a>
        <a href="/docs/standard-library/console" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Console
        </a>
      </div>
    </>
  );
}
