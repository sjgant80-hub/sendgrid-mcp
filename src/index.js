#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    "name": "gETAccessSettingsActivity",
    "description": "GET /access_settings/activity · Retrieve all recent access attempts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAccessSettingsWhitelist",
    "description": "GET /access_settings/whitelist · Retrieve a list of currently whitelisted IPs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAccessSettingsWhitelist",
    "description": "POST /access_settings/whitelist · Add one or more IPs to the whitelist",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAccessSettingsWhitelist",
    "description": "DELETE /access_settings/whitelist · Remove one or more IPs from the whitelist",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAccessSettingsWhitelistRuleId",
    "description": "GET /access_settings/whitelist/{rule_id} · Retrieve a specific whitelisted IP",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAccessSettingsWhitelistRuleId",
    "description": "DELETE /access_settings/whitelist/{rule_id} · Remove a specific IP from the whitelist",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAlerts",
    "description": "GET /alerts · Retrieve all alerts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "Authorization": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAlerts",
    "description": "POST /alerts · Create a new Alert",
    "inputSchema": {
      "type": "object",
      "properties": {
        "Authorization": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAlertsAlertId",
    "description": "GET /alerts/{alert_id} · Retrieve a specific alert",
    "inputSchema": {
      "type": "object",
      "properties": {
        "Authorization": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pATCHAlertsAlertId",
    "description": "PATCH /alerts/{alert_id} · Update an alert",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAlertsAlertId",
    "description": "DELETE /alerts/{alert_id} · Delete an alert",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETApiKeys",
    "description": "GET /api_keys · Retrieve all API Keys belonging to the authenticated user",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createApiKeys",
    "description": "POST /api_keys · Create API keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETApiKeysApiKeyId",
    "description": "GET /api_keys/{api_key_id} · Retrieve an existing API Key",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pUTApiKeysApiKeyId",
    "description": "PUT /api_keys/{api_key_id} · Update the name & scopes of an API Key",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pATCHApiKeysApiKeyId",
    "description": "PATCH /api_keys/{api_key_id} · Update API keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEApiKeysApiKeyId",
    "description": "DELETE /api_keys/{api_key_id} · Delete API keys",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmGroups",
    "description": "GET /asm/groups · Retrieve information about multiple suppression groups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAsmGroups",
    "description": "POST /asm/groups · Create a new suppression group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmGroupsGroupId",
    "description": "GET /asm/groups/{group_id} · Get information on a single suppression group.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pATCHAsmGroupsGroupId",
    "description": "PATCH /asm/groups/{group_id} · Update a suppression group.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "Authorization": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAsmGroupsGroupId",
    "description": "DELETE /asm/groups/{group_id} · Delete a suppression group.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmGroupsGroupIdSuppressions",
    "description": "GET /asm/groups/{group_id}/suppressions · Retrieve all suppressions for a suppression group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAsmGroupsGroupIdSuppressions",
    "description": "POST /asm/groups/{group_id}/suppressions · Add suppressions to a suppression group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAsmGroupsGroupIdSuppressionsSearch",
    "description": "POST /asm/groups/{group_id}/suppressions/search · Search for suppressions within a group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAsmGroupsGroupIdSuppressionsEmail",
    "description": "DELETE /asm/groups/{group_id}/suppressions/{email} · Delete a suppression from a suppression group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmSuppressions",
    "description": "GET /asm/suppressions · Retrieve all suppressions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTAsmSuppressionsGlobal",
    "description": "POST /asm/suppressions/global · Add recipient addresses to the global suppression group.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmSuppressionsGlobalEmail",
    "description": "GET /asm/suppressions/global/{email} · Retrieve a Global Suppression",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETEAsmSuppressionsGlobalEmail",
    "description": "DELETE /asm/suppressions/global/{email} · Delete a Global Suppression",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        },
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETAsmSuppressionsEmail",
    "description": "GET /asm/suppressions/{email} · Retrieve all suppression groups for an email address",
    "inputSchema": {
      "type": "object",
      "properties": {
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETBrowsersStats",
    "description": "GET /browsers/stats · Retrieve email statistics by browser.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "start_date": {
          "type": "string"
        },
        "end_date": {
          "type": "string"
        },
        "limit": {
          "type": "string"
        },
        "offset": {
          "type": "string"
        },
        "aggregated_by": {
          "type": "string"
        },
        "browsers": {
          "type": "string"
        },
        "on-behalf-of": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETCampaigns",
    "description": "GET /campaigns · Retrieve all Campaigns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "string"
        },
        "offset": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pOSTCampaigns",
    "description": "POST /campaigns · Create a Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETCampaignsCampaignId",
    "description": "GET /campaigns/{campaign_id} · Retrieve a single campaign",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "pATCHCampaignsCampaignId",
    "description": "PATCH /campaigns/{campaign_id} · Update a Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "dELETECampaignsCampaignId",
    "description": "DELETE /campaigns/{campaign_id} · Delete a Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "gETCampaignsCampaignIdSchedules",
    "description": "GET /campaigns/{campaign_id}/schedules · View Scheduled Time of a Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "pOSTCampaignsCampaignIdSchedules",
    "description": "POST /campaigns/{campaign_id}/schedules · Schedule a Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "pATCHCampaignsCampaignIdSchedules",
    "description": "PATCH /campaigns/{campaign_id}/schedules · Update a Scheduled Campaign",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "string"
        }
      }
    }
  }
];
const UPSTREAM = process.env.UPSTREAM || 'https://sendgrid.com';
const APIKEY = process.env.SENDGRID_KEY || process.env.API_KEY || '';

const server = new Server({ name: 'sendgrid-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error('unknown tool');
  const args = req.params.arguments || {};
  const path = tool.description.match(/(GET|POST|PUT|PATCH|DELETE) (\S+)/) || [];
  const method = path[1] || 'GET';
  let url = new URL(path[2] || '/', UPSTREAM);
  for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && url.pathname.includes('{' + k + '}')) url.pathname = url.pathname.replace('{' + k + '}', v);
  const opts = { method, headers: { Authorization: APIKEY ? 'Bearer ' + APIKEY : '' } };
  if (method !== 'GET' && Object.keys(args).length) { opts.body = JSON.stringify(args); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const txt = await res.text();
  return { content: [{ type: 'text', text: txt.slice(0, 4000) }] };
});

await server.connect(new StdioServerTransport());
console.error('sendgrid-mcp v1.0.0 · stdio ready · 40 tools');
