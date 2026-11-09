export interface PluginInstall {
  scope: string;
  projectPath?: string;
  installPath: string;
}

export function chooseInstall(entries: PluginInstall[], roots: string[]): string;
