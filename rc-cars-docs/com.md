# Menu flow

| Car/Color selection | -> |        Ready        |

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
```
{
  'message': 'start',
  'data': {}
}
```

The client will not respond. It will proceed with loading the in-game controller.

### Buttons

* **Unready**: Moves to the Car/Color Selection menu on the controller. Sends an "Unready" message to the server.
