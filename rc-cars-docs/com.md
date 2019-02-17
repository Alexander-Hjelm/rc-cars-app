# Menu flow

|   Car selection   | -> |  Color selection  | -> |       Ready       |

# Menu functionality

## Color selection menu

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
* **Ready**: Moves to the Ready menu on the controller. Sends a "Ready" message to the server.
* **Back**: Moves to the Car selection menu on the controller. Sends no message to the server.
