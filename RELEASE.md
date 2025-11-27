# Release Guide for Theia Data Bridge

This document describes how to release new versions of the theia-data-bridge extension using GitHub Actions.

## Overview

The release process is automated using GitHub Actions and consists of three workflows:

1. **Build & Test** (`build.yml`) - Runs on every push and PR to validate the code
2. **Package** (`package.yml`) - Builds the `.vsix` file (can be triggered manually or by release)
3. **Release** (`release.yml`) - Publishes to VS Code Marketplace and/or Open VSX Registry

## Release Process

### 1. Prepare for Release

Before creating a release, ensure:

- [ ] All changes are merged to `main`
- [ ] Tests are passing
- [ ] Version in `package.json` is ready (it will be updated automatically during release)
- [ ] CHANGELOG is updated (if you maintain one)

### 2. Create a GitHub Release

1. Go to your repository on GitHub
2. Click on "Releases" in the right sidebar
3. Click "Draft a new release"
4. Create a new tag following semantic versioning (e.g., `v0.1.0`, `v1.0.0`)
   - Format: `v<major>.<minor>.<patch>`
   - Example: `v0.1.0` for the first release
5. Fill in the release title and description
6. Click "Publish release"

### 3. Automated Publishing

Once you publish the release, GitHub Actions will automatically:

1. ✅ Check out the code
2. ✅ Install dependencies (using pnpm)
3. ✅ Update `package.json` version to match the tag (strips the `v` prefix)
4. ✅ Build the extension (`pnpm run build`)
5. ✅ Package the extension into a `.vsix` file (`pnpm run package`)
6. ✅ Publish to VS Code Marketplace (if enabled)
7. ✅ Publish to Open VSX Registry (if enabled)
8. ✅ Upload the `.vsix` file as a release asset

## Configuration

### Required Secrets

You need to configure the following secrets in your GitHub repository settings:

#### For VS Code Marketplace Publishing

1. **`VSCE_PUBLISH_TOKEN`** - Personal Access Token from Azure DevOps
   - Go to https://dev.azure.com
   - Create a new organization if needed
   - User Settings → Personal Access Tokens → New Token
   - Scopes: `Marketplace` → `Acquire` and `Manage`
   - Copy the token and add as a GitHub secret

#### For Open VSX Registry Publishing

2. **`OVSX_PUBLISH_TOKEN`** - Access Token from Open VSX
   - Go to https://open-vsx.org
   - Sign in with GitHub
   - Settings → Access Tokens → New Access Token
   - Copy the token and add as a GitHub secret

### Required Variables

Configure these variables in Settings → Secrets and variables → Actions → Variables:

- **`PUBLISH_VSCODE`** - Set to `true` to enable VS Code Marketplace publishing
- **`PUBLISH_OVSX`** - Set to `true` to enable Open VSX Registry publishing

> **Note**: You can enable one or both publishing targets. If you only want to create `.vsix` files without publishing, set both to `false` or leave them unset.

### Environment Protection (Recommended)

For additional safety, configure a `prod` environment:

1. Go to Settings → Environments → New environment
2. Name: `prod`
3. Add protection rules (optional but recommended):
   - Required reviewers (require manual approval before publishing)
   - Deployment branches (only allow releases from `main`)

## Local Testing

Before creating a release, you can test the packaging locally:

```bash
# Install dependencies
pnpm install

# Build the extension
pnpm run build

# Package the extension
pnpm run package
```

This creates a `.vsix` file that you can:
- Install locally: `code --install-extension theia-data-bridge-0.0.1.vsix`
- Share with others for testing
- Manually upload to the marketplace

## Manual Installation for Testing

To install the extension on other machines for testing:

### Method 1: From GitHub Release

1. Go to the Releases page
2. Download the `.vsix` file from the latest release
3. In VS Code: Extensions → "..." menu → "Install from VSIX..."
4. Select the downloaded file

### Method 2: Build Locally and Share

```bash
# Build and package
pnpm run build && pnpm run package

# Share the generated .vsix file
# Install on target machine:
code --install-extension theia-data-bridge-X.Y.Z.vsix
```

### Method 3: Install via Command Line

```bash
# From a URL (after GitHub release)
code --install-extension https://github.com/YOUR_ORG/theia-data-bridge/releases/download/v0.1.0/theia-data-bridge-0.1.0.vsix
```

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, backwards compatible

Examples:
- `v0.1.0` - First release
- `v0.1.1` - Bug fix
- `v0.2.0` - New feature
- `v1.0.0` - First stable release

## Troubleshooting

### Build Fails

Check the GitHub Actions logs:
1. Go to Actions tab
2. Click on the failed workflow run
3. Expand the failed step to see the error

Common issues:
- TypeScript errors: Run `pnpm run ts:check` locally
- Linting errors: Run `pnpm run lint` locally
- Missing dependencies: Ensure `pnpm-lock.yaml` is committed

### Publishing Fails

1. **VS Code Marketplace**: Verify your `VSCE_PUBLISH_TOKEN` is valid
2. **Open VSX**: Verify your `OVSX_PUBLISH_TOKEN` is valid
3. **Publisher Mismatch**: Ensure the `publisher` field in `package.json` matches your marketplace publisher ID

### Extension Not Working After Install

1. Check the extension logs: View → Output → Select "theia-data-bridge"
2. Verify the server started: Look for "HTTP server started" message
3. Test the server: `curl http://127.0.0.1:16281/`

## Workflow Files

### `.github/workflows/build.yml`
Runs on every push/PR. Validates code quality (type checking, linting, building).

### `.github/workflows/package.yml`
Reusable workflow that builds and packages the `.vsix` file. Can be called by other workflows.

### `.github/workflows/release.yml`
Triggered when you publish a GitHub release. Packages and publishes the extension.

## Best Practices

1. **Test Before Release**: Always test the built `.vsix` file locally before publishing
2. **Update Documentation**: Keep README.md and CHANGELOG.md up to date
3. **Use Pre-releases**: For beta versions, mark the GitHub release as "pre-release"
4. **Gradual Rollout**: Consider releasing to Open VSX first (for Theia testing) before VS Code Marketplace
5. **Version Tags**: Always use `v` prefix for tags (e.g., `v1.0.0`)

## Next Steps

After setting up the release workflow:

1. Configure the required secrets and variables
2. Make a test release (e.g., `v0.1.0`)
3. Verify the extension works when installed from the `.vsix` file
4. If publishing to marketplaces, verify it appears correctly

## Additional Resources

- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX Publishing](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
- [GitHub Actions](https://docs.github.com/en/actions)

