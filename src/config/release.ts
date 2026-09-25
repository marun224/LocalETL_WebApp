/**
 * The desktop releases the download page links to.
 *
 * Installers are published on GitHub Releases in a public repository that holds
 * only installers; the engine's source stays private for now. Every value here
 * is copied from the release's SHA256SUMS.txt, so what the page says about a
 * file is what the file is.
 *
 * `published` stays false until the release is live on GitHub. While it is
 * false the page links to nothing, because a download link that 404s is the
 * one thing this site promised not to show.
 */

export const RELEASES_REPO = 'https://github.com/marun224/headrace-releases';

export interface DesktopRelease {
  version: string;
  /** The installer's file name, as attached to the GitHub release. */
  file: string;
  /** Size in MB, rounded to one decimal. */
  sizeMb: number;
  sha256: string;
  /** Not code-signed yet: Windows SmartScreen will ask before it runs. */
  signed: boolean;
  published: boolean;
}

export const WINDOWS: DesktopRelease | null = {
  version: '0.1.0-preview.1',
  file: 'Headrace-0.1.0-preview.1-windows-x64-setup.exe',
  sizeMb: 65.9,
  sha256: '9c466541824cf0285cfafb313751bbfa21c837994522b3dfec776fc7ad1229ad',
  signed: false,
  // Set true once https://github.com/marun224/headrace-releases/releases/tag/v0.1.0-preview.1
  // is live (scripts/publish-release.ps1 -Publish in the engine repo), then redeploy.
  published: false,
};

/** Where a release's file is downloaded from. */
export function downloadUrl(release: DesktopRelease): string {
  return `${RELEASES_REPO}/releases/download/v${release.version}/${release.file}`;
}

/** The release's own page, with its notes and checksums. */
export function releasePage(release: DesktopRelease): string {
  return `${RELEASES_REPO}/releases/tag/v${release.version}`;
}
