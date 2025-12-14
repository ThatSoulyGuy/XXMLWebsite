import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Network Module",
  description: "XXML Language::Network module reference",
};

function ClassHeader({ name, description }: { name: string; description: string }) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100" id={name.toLowerCase()}>
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

export default function NetworkPage() {
  return (
    <>
      <h1>Network Module</h1>
      <p className="lead">
        The <code>Language::Network</code> module provides HTTP client and server
        capabilities for network communication.
      </p>

      <CodeBlock language="xxml">{`#import Language::Network;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-3">
        {["HTTPClient", "HTTPResponse", "HTTPServer"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      <ClassHeader name="HTTPClient" description="HTTP client for making web requests." />

      <h3>Quick Methods</h3>
      <MethodTable
        methods={[
          { name: "get", params: "url: String^", returns: "HTTPResponse^", desc: "HTTP GET request" },
          { name: "post", params: "url: String^, body: String^", returns: "HTTPResponse^", desc: "HTTP POST request" },
          { name: "put", params: "url: String^, body: String^", returns: "HTTPResponse^", desc: "HTTP PUT request" },
          { name: "delete", params: "url: String^", returns: "HTTPResponse^", desc: "HTTP DELETE request" },
          { name: "patch", params: "url: String^, body: String^", returns: "HTTPResponse^", desc: "HTTP PATCH request" },
        ]}
      />

      <CodeBlock language="xxml">{`// Simple GET request
Instantiate Network::HTTPResponse^ As <response> = Network::HTTPClient::get(
    String::Constructor("https://api.example.com/users")
);

If (response.isSuccess().toBool())
{
    Instantiate String^ As <body> = response.getBody();
    Run System::Console::printLine(body);
}

// POST with JSON body
Instantiate Network::HTTPResponse^ As <postResponse> = Network::HTTPClient::post(
    String::Constructor("https://api.example.com/users"),
    String::Constructor("{\\"name\\": \\"Alice\\"}")
);`}</CodeBlock>

      <h3>Configuration</h3>
      <MethodTable
        methods={[
          { name: "setHeader", params: "name: String^, value: String^", returns: "HTTPClient^", desc: "Set request header" },
          { name: "setTimeout", params: "ms: Integer^", returns: "HTTPClient^", desc: "Set timeout in milliseconds" },
          { name: "send", params: "", returns: "HTTPResponse^", desc: "Execute configured request" },
        ]}
      />

      <CodeBlock language="xxml">{`// Configured request with headers
Instantiate Network::HTTPClient^ As <client> = Network::HTTPClient::Constructor();

Run client.setHeader(
    String::Constructor("Content-Type"),
    String::Constructor("application/json")
);
Run client.setHeader(
    String::Constructor("Authorization"),
    String::Constructor("Bearer token123")
);
Run client.setTimeout(Integer::Constructor(5000));

// Make the request
Instantiate Network::HTTPResponse^ As <response> = client.post(
    String::Constructor("https://api.example.com/data"),
    String::Constructor("{\\"key\\": \\"value\\"}")
);`}</CodeBlock>

      <ClassHeader name="HTTPResponse" description="Represents an HTTP response from a server." />

      <MethodTable
        methods={[
          { name: "getStatusCode", params: "", returns: "Integer^", desc: "HTTP status code (200, 404, etc.)" },
          { name: "getBody", params: "", returns: "String^", desc: "Response body as string" },
          { name: "getHeader", params: "name: String^", returns: "String^", desc: "Get specific header value" },
          { name: "getHeaders", params: "", returns: "List<String>^", desc: "Get all header names" },
          { name: "isSuccess", params: "", returns: "Bool^", desc: "Check if status is 2xx" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Network::HTTPResponse^ As <response> = Network::HTTPClient::get(
    String::Constructor("https://api.example.com/status")
);

// Check status
Instantiate Integer^ As <status> = response.getStatusCode();
Run System::Console::printLine(
    String::Constructor("Status: ").append(status.toString())
);

// Check if successful (2xx)
If (response.isSuccess().toBool())
{
    // Get body
    Instantiate String^ As <body> = response.getBody();
    Run System::Console::printLine(body);

    // Get specific header
    Instantiate String^ As <contentType> = response.getHeader(
        String::Constructor("Content-Type")
    );
    Run System::Console::printLine(
        String::Constructor("Content-Type: ").append(contentType)
    );
}
Else
{
    Run System::Console::printLine(String::Constructor("Request failed!"));
}`}</CodeBlock>

      <Callout type="info">
        Common HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request),
        401 (Unauthorized), 404 (Not Found), 500 (Server Error).
      </Callout>

      <ClassHeader name="HTTPServer" description="Simple HTTP server for handling incoming requests." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "port: Integer^", returns: "HTTPServer^", desc: "Create server on port" },
          { name: "route", params: "path: String^, handler: Lambda", returns: "HTTPServer^", desc: "Register route handler" },
          { name: "start", params: "", returns: "None", desc: "Start listening" },
          { name: "stop", params: "", returns: "None", desc: "Stop server" },
          { name: "isRunning", params: "", returns: "Bool^", desc: "Check if running" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create server on port 8080
Instantiate Network::HTTPServer^ As <server> = Network::HTTPServer::Constructor(
    Integer::Constructor(8080)
);

// Register routes
Run server.route(
    String::Constructor("/"),
    Lambda (request: Request&) -> Response^ {
        Return Response::text(String::Constructor("Hello, World!"));
    }
);

Run server.route(
    String::Constructor("/api/status"),
    Lambda (request: Request&) -> Response^ {
        Return Response::json(String::Constructor("{\\"status\\": \\"ok\\"}"));
    }
);

// Start server
Run System::Console::printLine(String::Constructor("Starting server on port 8080..."));
Run server.start();`}</CodeBlock>

      <Callout type="warning">
        The server runs synchronously. For production use, consider running
        the server in a separate thread using the Concurrent module.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="http_client.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Network;
#import Language::Format;
#import Language::System;

[ Entrypoint
    {
        Run System::Console::printLine(String::Constructor("=== HTTP Client Demo ==="));

        // GET request to a public API
        Instantiate String^ As <url> = String::Constructor(
            "https://jsonplaceholder.typicode.com/posts/1"
        );

        Run System::Console::printLine(
            String::Constructor("Fetching: ").append(url)
        );

        Instantiate Network::HTTPResponse^ As <response> = Network::HTTPClient::get(url);

        Run System::Console::printLine(
            String::Constructor("Status: ").append(response.getStatusCode().toString())
        );

        If (response.isSuccess().toBool())
        {
            Run System::Console::printLine(String::Constructor(""));
            Run System::Console::printLine(String::Constructor("Response:"));

            // Parse JSON response
            Instantiate Format::JSONObject^ As <post> = Format::JSONObject::parse(
                response.getBody()
            );

            Instantiate String^ As <title> = post.getString(String::Constructor("title"));
            Instantiate Integer^ As <userId> = post.getInt(String::Constructor("userId"));

            Run System::Console::printLine(
                String::Constructor("  Title: ").append(title)
            );
            Run System::Console::printLine(
                String::Constructor("  User ID: ").append(userId.toString())
            );
        }
        Else
        {
            Run System::Console::printLine(String::Constructor("Request failed!"));
        }

        // POST example
        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(String::Constructor("=== POST Request ==="));

        Instantiate Format::JSONObject^ As <newPost> = Format::JSONObject::Constructor();
        Run newPost.put(String::Constructor("title"), String::Constructor("My Post"));
        Run newPost.put(String::Constructor("body"), String::Constructor("Post content here"));
        Run newPost.put(String::Constructor("userId"), Integer::Constructor(1));

        Instantiate Network::HTTPClient^ As <client> = Network::HTTPClient::Constructor();
        Run client.setHeader(
            String::Constructor("Content-Type"),
            String::Constructor("application/json")
        );

        Instantiate Network::HTTPResponse^ As <postResponse> = client.post(
            String::Constructor("https://jsonplaceholder.typicode.com/posts"),
            newPost.toString()
        );

        Run System::Console::printLine(
            String::Constructor("POST Status: ").append(postResponse.getStatusCode().toString())
        );

        If (postResponse.isSuccess().toBool())
        {
            Run System::Console::printLine(String::Constructor("Post created successfully!"));
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/format" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Format Module
        </a>
        <a href="/docs/standard-library/concurrent" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Concurrent Module
        </a>
      </div>
    </>
  );
}
