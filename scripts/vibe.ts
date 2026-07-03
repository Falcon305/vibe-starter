import { runDoctor } from "./registry/doctor";
import { installModules, removeModule, updateModule } from "./registry/install";
import { readLockfile } from "./registry/lockfile";
import { listModuleNames, loadManifest } from "./registry/registry";

function print(message = ""): void {
  process.stdout.write(`${message}\n`);
}

function commandList(): void {
  const installed = new Set(readLockfile().modules.map((module) => module.name));
  const names = listModuleNames();
  if (names.length === 0) {
    print("No modules found in registry/.");
    return;
  }
  print("Available modules:");
  print();
  for (const name of names) {
    const manifest = loadManifest(name);
    const marker = installed.has(name) ? "[installed]" : "           ";
    print(`  ${marker} ${manifest.name.padEnd(22)} ${manifest.description}`);
  }
}

function commandSearch(term: string): void {
  const needle = term.toLowerCase();
  const installed = new Set(readLockfile().modules.map((module) => module.name));
  const matches = listModuleNames()
    .map(loadManifest)
    .filter(
      (manifest) =>
        manifest.name.toLowerCase().includes(needle) ||
        manifest.title.toLowerCase().includes(needle) ||
        manifest.description.toLowerCase().includes(needle),
    );
  if (matches.length === 0) {
    print(`No modules match "${term}".`);
    return;
  }
  print(`Modules matching "${term}":`);
  print();
  for (const manifest of matches) {
    const marker = installed.has(manifest.name) ? "[installed]" : "           ";
    print(`  ${marker} ${manifest.name.padEnd(22)} ${manifest.description}`);
  }
}

function commandUpdate(name: string): void {
  const result = updateModule(name);
  if (!result.updated) {
    print(`Not installed: ${name}`);
    process.exit(1);
  }
  print(`Updated: ${name}`);
  if (result.envAdded.length) {
    print();
    print("Added to .env.example (set real values in .env.local):");
    for (const line of result.envAdded) print(`  ${line}`);
  }
  if (result.depsChanged) {
    print();
    print("Dependencies changed. Run: pnpm install");
  }
}

function commandInfo(name: string): void {
  const manifest = loadManifest(name);
  print(`${manifest.title} (${manifest.name})`);
  print(manifest.description);
  print();
  print(`Category:   ${manifest.category}`);
  if (manifest.dependsOn.length) print(`Depends on: ${manifest.dependsOn.join(", ")}`);
  if (manifest.provides.length) print(`Provides:   ${manifest.provides.join(", ")}`);
  if (manifest.env.length) print(`Env:        ${manifest.env.map((e) => e.key).join(", ")}`);
  if (manifest.routes.length) print(`Routes:     ${manifest.routes.join(", ")}`);
}

function commandAdd(names: string[]): void {
  if (names.length === 0) throw new Error("Usage: vibe add <module...>");
  const result = installModules(names);

  if (result.installed.length) print(`Installed: ${result.installed.join(", ")}`);
  if (result.skipped.length) print(`Already installed: ${result.skipped.join(", ")}`);

  if (result.envAdded.length) {
    print();
    print("Added to .env.example (set real values in .env.local):");
    for (const line of result.envAdded) print(`  ${line}`);
  }
  if (result.depsChanged) {
    print();
    print("Dependencies changed. Run: pnpm install");
  }
  if (result.postInstall.length) {
    print();
    print("Next steps:");
    for (const step of result.postInstall) print(`  - ${step}`);
  }
}

function commandRemove(names: string[]): void {
  if (names.length === 0) throw new Error("Usage: vibe remove <module...>");
  for (const name of names) {
    const removed = removeModule(name);
    print(removed ? `Removed: ${name}` : `Not installed: ${name}`);
  }
  print();
  print("Run pnpm install to prune unused dependencies if needed.");
}

function commandDoctor(): void {
  print("Running vibe doctor...");
  print();
  if (!runDoctor()) process.exit(1);
}

function commandHelp(): void {
  print("vibe — registry module manager");
  print();
  print("Commands:");
  print("  list                 List available modules");
  print("  search <term>        Find modules by name or description");
  print("  info <module>        Show a module manifest");
  print("  add <module...>      Install modules and their dependencies");
  print("  update <module>      Re-copy a module's files from the registry");
  print("  remove <module...>   Remove installed modules");
  print("  doctor               Check the installed set for conflicts and drift");
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case "list":
      return commandList();
    case "search":
      if (!args[0]) throw new Error("Usage: vibe search <term>");
      return commandSearch(args[0]);
    case "info":
      if (!args[0]) throw new Error("Usage: vibe info <module>");
      return commandInfo(args[0]);
    case "add":
      return commandAdd(args);
    case "update":
      if (!args[0]) throw new Error("Usage: vibe update <module>");
      return commandUpdate(args[0]);
    case "remove":
      return commandRemove(args);
    case "doctor":
      return commandDoctor();
    case "help":
    case undefined:
      return commandHelp();
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
