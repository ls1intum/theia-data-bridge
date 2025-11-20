# Theia Credential Bridge

The theia creential bridge is a VSCode extension allowing injecting and retrieving credentials. The injection is done via HTTP requests
from the VSCode host and the retrieval is handled using VSCode commands.

## Architecture

### Credential Injection

The extension exposes a lean HTTP server running on `0.0.0.0:16281`.

It offes an endpoint `POST /credentials` to inject credentials.

It will store those credentials in memory and offer them to other extensions via VSCode commands.

### Credential Retrieval

The extension exposes a set of VSCode commands to handle retrieval of credentials.

- `credentialBridge.getEnv`
    - Takes a list of environment variables
    - Returns a dictionary of stored environment variables

### Creedential Storage

The extension will store the credentials in memory.
