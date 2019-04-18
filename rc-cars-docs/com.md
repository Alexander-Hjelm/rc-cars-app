# Menu flow

|    Main menu     | -> | Car/Color selection | -> |   Practice level   |-> |     Race level     |

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

# Menu functionality

## Car/Color Selection menu

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

---
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

---
#### Ready
```
{
  'message': 'ready',
  'data': {}
}
```

The server will not respond.

### Buttons

* **Color selection**: A list of buttons that each send a "Color Selected" message to the server.
* **Left/Right**: Two arrow buttons that send Move messages to the server with value = 1 or value = -1.
* **Ready**: Moves to the Ready menu on the controller. Sends a "Ready" message to the server.
* **Back**: Moves to the Car selection menu on the controller. Sends no message to the server.

## Ready menu

### Client to Server messages

#### Unready
```
{
  'message': 'unready',
  'data': {}
}
```

The server will not respond.

### Server to Client messages

#### Start
```
{
  'message': 'start',
  'data': {}
}
```

The client will not respond. It will proceed with loading the in-game controller.

### Buttons

* **Unready**: Moves to the Car/Color Selection menu on the controller. Sends an "Unready" message to the server.
