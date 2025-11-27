import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" +
      hostname +
      "/api/v2/connection?include_secrets=true&connector_names=github",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("GitHub not connected");
  }
  return accessToken;
}

async function pushToGitHub() {
  try {
    const accessToken = await getAccessToken();
    const octokit = new Octokit({ auth: accessToken });

    // Get current user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`Logged in as: ${user.login}`);

    const repoName = "minecraft-bot-manager";
    const repoDescription =
      "Professional web-based management platform for Minecraft bots";

    // Create repository
    console.log(`Creating repository: ${repoName}...`);
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser(
      {
        name: repoName,
        description: repoDescription,
        private: false,
        auto_init: false,
      }
    );

    console.log(`Repository created: ${repo.html_url}`);

    // Configure git
    const repoUrl = `https://${accessToken}@github.com/${user.login}/${repoName}.git`;

    try {
      execSync("git config --global user.email 'replit@example.com'", {
        stdio: "inherit",
      });
      execSync("git config --global user.name 'Replit Bot'", {
        stdio: "inherit",
      });
    } catch (e) {
      console.log("Git config already set");
    }

    // Initialize git if needed
    try {
      execSync("git status", { stdio: "pipe" });
    } catch (e) {
      console.log("Initializing git repository...");
      execSync("git init", { stdio: "inherit" });
      execSync("git add .", { stdio: "inherit" });
      execSync("git commit -m 'Initial commit'", { stdio: "inherit" });
    }

    // Add remote and push
    console.log("Adding remote origin...");
    try {
      execSync(`git remote remove origin`, { stdio: "pipe" });
    } catch (e) {
      // Remote doesn't exist yet
    }

    execSync(`git remote add origin ${repoUrl}`, { stdio: "inherit" });
    console.log("Pushing to GitHub...");
    execSync("git branch -M main", { stdio: "inherit" });
    execSync("git push -u origin main", { stdio: "inherit" });

    console.log("\n✅ Successfully pushed to GitHub!");
    console.log(`Repository URL: ${repo.html_url}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

pushToGitHub();
