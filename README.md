# Theia Data Bridge

The theia creential bridge is a VSCode extension allowing injecting and retrieving data. The injection is done via HTTP requests
from the VSCode host and the retrieval is handled using VSCode commands.

## Architecture

### CredDataential Injection

The extension exposes a lean HTTP server running on `0.0.0.0:16281`.

It offers an endpoint `POST /data` to inject data.

It will store those data in memory and offer them to other extensions via VSCode commands.

### Data Retrieval

The extension exposes a set of VSCode commands to handle retrieval of data.

- `dataBridge.getEnv`
    - Takes a list of environment variables
    - Returns a dictionary of stored environment variables

### Data Storage

The extension will store the data in memory.
