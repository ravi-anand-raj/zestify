// @ts-nocheck
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tool, jsonSchema } from "ai";

// Global cache for the MCP client to prevent reconnecting on every API call in dev
let mcpClientInstance: Client | null = null;
let mcpTransport: StdioClientTransport | null = null;

export async function getMcpClient(): Promise<Client> {
  if (mcpClientInstance) {
    return mcpClientInstance;
  }

  // Define the transport - we'll run a local mock webdata server for now
  mcpTransport = new StdioClientTransport({
    command: "node",
    args: ["alpha-vantage-mcp.js"],
    env: {
      ...process.env,
      ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || "1CIKBZFMIFJXC9SD",
      FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || "d8ncIb1r01qvvn95kv0d8nclb1r01qvvn95kvg"
    } as NodeJS.ProcessEnv
  });

  const client = new Client(
    {
      name: "zust-ai-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  await client.connect(mcpTransport);
  mcpClientInstance = client;
  return client;
}

export async function getMcpTools() {
  try {
    const client = await getMcpClient();
    const { tools: mcpTools } = await client.listTools();

    const aiTools: Record<string, any> = {};

    for (const t of mcpTools) {
      aiTools[t.name] = tool({
        description: t.description,
        // Convert MCP JSON schema to AI SDK JSON schema format
        parameters: jsonSchema(t.inputSchema as any),
        execute: async (args: any) => {
          console.log(`[MCP Tool Called] ${t.name}`, args);
          const result = await client.callTool({
            name: t.name,
            arguments: args as any,
          });
          return result;
        },
      });
    }

    return aiTools;
  } catch (error) {
    console.error("Failed to fetch MCP tools:", error);
    // Return empty tools if MCP server is down, so the app doesn't crash
    return {};
  }
}
