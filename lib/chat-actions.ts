interface ActionParams {
  [key: string]: any;
}

export async function runAction(action: string, params: ActionParams) {
  try {
    switch (action) {
      case "fetch_github_stats": {
        const { owner, repo } = params;
        const response = await fetch(`/api/actions/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
        return await response.json();
      }
      
      case "fetch_weather": {
        const { location } = params;
        const response = await fetch(`/api/actions/weather?location=${encodeURIComponent(location)}`);
        return await response.json();
      }
      
      case "create_todo": {
        const response = await fetch('/api/actions/todo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        return await response.json();
      }
      
      case "calculate": {
        const response = await fetch('/api/actions/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        return await response.json();
      }
      
      case "get_time": {
        const { timezone = "UTC" } = params;
        const response = await fetch(`/api/actions/time?timezone=${encodeURIComponent(timezone)}`);
        return await response.json();
      }
      
      case "search_web": {
        // Placeholder for web search - integrate with your preferred search API
        return {
          query: params.query,
          message: "Web search feature - integrate with your preferred search API",
          suggestion: "Try Google, Bing, or DuckDuckGo APIs"
        };
      }
      
      default:
        return { error: `Unknown action: ${action}` };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}