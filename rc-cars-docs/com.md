# Menu flow

|    Main menu     | -> | Car/Color selection | -> |   Practice level   |-> |     Race level     |


# Server-issued messages (General)
These messages may be issued by the server to a client at any time, regardless of state.
## State change
```
{
  'message': 'update-state',
  'data': {
    'state-id' : <integer>
  }
}
```

The client will not respond.

## Ready query
```
{
  'message': 'ready-query',
  'data': {}
}
```

The client will respond with the following message:
```
{
  'message': 'ready',
  'data': {}
}
```

## State query
```
{
  'message': 'state-query',
  'data': {}
}
```

The client will respond with the following message, where state-id is the state id of the currently loaded controller:
```
{
  'message': 'state-response',
  'data': {
    'state-id' : <integer>
  }
}
```

# Reconnect
```
{
  'message': 'ReconnectData',
  'data': {
    'state-id' : <integer>,
    'car-id' : <integer>,
    'active-powerup-id' : <integer>,
    'color-r' : <integer>,
    'color-g' : <integer>,
    'color-b' : <integer>
  }
}
```

# Data

## State by id
* **0**: No state
* **1**: Loading
* **2**: Menu navigation (only for host)
* **3**: Wait for host (only for non-hosts)
* **4**: Car/color selection
* **5**: Practice mode
* **6**: Racing mode

## Powerups by id
* **0**: None
* **1**: Landmine
* **2**: Bowling ball
* **3**: Speed boost

## Cars by id
* **0**: None
* **1**: Rebel

# State-specific functionality

## Menu navigation (State 2, Host only)

#### Move
```
{
  'message': 'move',
  'data': {
    'value' : <integer>,
  }
}
```

The server will not respond.

#### Accept
```
{
  'message': 'accept',
  'data': {}
}
```

The server will not respond.

#### Back
```
{
  'message': 'back',
  'data': {}
}
```

The server will not respond.

### Buttons
* **Left/Right**: Two arrow buttons that send Move messages to the server with value = 1 or value = -1.
* **Accept**: Sends an Accept message to the server.
* **Back**: Sends a Back message to the server.

## Car/Color Selection menu (State 4)

### Client to Server messages

#### Color selected
```
{
  'message': 'color-selected',
  'data': {
    'r' : <integer>,
    'g' : <integer>,
    'b' : <integer>
  }
}
```

The server will respond by BROADCASTING the following two messages:

```
{
  'message': 'color-reserved',
  'data': {
    'r' : <integer>,
    'g' : <integer>,
    'b' : <integer>
  }
}
```

and

```
{
  'message': 'color-unreserved',
  'data': {
    'r' : <integer>,
    'g' : <integer>,
    'b' : <integer>
  }
}
```

Where:
* **color-reserved** is the color that was recently picked. No player may now pick this color.
* **color-unreserved** is the color that was recently switch from, if any. All players may now pick this color.

#### Move
```
{
  'message': 'move',
  'data': {
    'value' : <integer>,
  }
}
```

The server will not respond.

#### Ready
```
{
  'message': 'ready',
  'data': {}
}
```

The server will not respond.

#### Unready
```
{
  'message': 'unready',
  'data': {}
}
```

The server will not respond.

### Buttons

* **Color selection**: A list of buttons that each send a "Color Selected" message to the server.
* **Left/Right**: Two arrow buttons that send Move messages to the server with value = 1 or value = -1.
* **Ready/Unready**: Sends a "Ready" or an "Unready" message to the server.

## Practice mode (State 5)

### Client to Server messages

#### Ready
```
{
  'message': 'ready',
  'data': {}
}
```

The server will not respond.

#### Unready
```
{
  'message': 'unready',
  'data': {}
}
```

The server will not respond.

## Racing mode (State 6)

### Server to Client messages

#### Defeated, Round
The player was defeated in this round, but will come back in the next round.
```
{
  'message': 'defeated-round',
  'data': {}
}
```

The client will not respond

#### Round restart
The round is over and the next one begins now. This message will only be sent to players who are still alive.
```
{
  'message': 'round-restart',
  'data': {}
}
```

The client will not respond

#### Defeated, Game
The player was defeated in this game, and will not come back in future rounds until the next game begins.
```
{
  'message': 'defeated-game',
  'data': {}
}
```

The server will not respond.

### Buttons

* **Ready/Unready**: Sends a "Ready" or an "Unready" message to the server.
