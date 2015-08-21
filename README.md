# TRONament
A TRON-like game in which A.I.s can compete against each other, written in JavaScript.

Write your own A.I. to play the game, and compete against your friends to make the smartest A.I.!

## Overview
TRONament is two things: an interactive TRON-like game, and a framework for writing artificial intelligence game players in JavaScript. TRONament provides a system that makes it easy to write A.I. programs that are able to play the game with minimal boilerplate code.

The game itself is reminiscent of the classic TRON light cycles game, with a large grid that players can maneuver on. As a player moves, a light trail is left behind. Similar to the classic game Snake, you cannot pass these trails left behind by any player, and running into a trail or any wall will result in instant death.

The game is primarily a multiplayer game, with multiple players competing on the same computer. Usually, each player is a different A.I. program, but human players are also supported.

## Using A.I. players
When starting up the game, you can select predefined A.I. programs (or human-controlled) for each player in the game. When the game starts, the corresponding A.I. programs will be launched and connected to the appropriate players in the game.

## Writing an A.I.
Writing your own A.I. program is what TRONament is all about! Creating your own A.I. is as simple as writing your own JavaScript script file. But be warned -- making a *smart* player is no easy task, and requires creativity and innovation. You know all those machine learning algorithms you learned in college? Those would be a good start!

Let's look at how to actually integrate with TRONament and write a basic A.I. TRONament players are file-based and can be loaded into the game from the game menu. To start, create a new file ending with `.js` and give it a name -- `my-ai.js`, for example.

Now open up the file in your favorite code editor. Below is a very simple A.I. program that can be used in TRONament:

```js
tronament.aiModule("example-ai", function() {
    this.move = function() {
        if (this.queryRelative(0, -1) == tronament.EMPTY) {
            return tronament.NORTH;
        } else if (this.queryRelative(0, 1) == tronament.EMPTY) {
            return tronament.SOUTH;
        } else if (this.queryRelative(1, 0) == tronament.EMPTY) {
            return tronament.EAST;
        } else {
            return tronament.WEST;
        }
    }
});
```

In this example, you can see we are using several APIs provided by the TRONament framework. All of TRONament's classes and functions are always available in the `tronament` namespace inside your A.I. program. The first function, and the most important, is `tronament.aiModule()`. This function acts as an entry point for defining a new A.I. and registers it with the game all at once. The `aiModule()` method takes two parameters: an A.I. name, and a class constructor function.

### The A.I. class
Each A.I. program is defined as a single class. The constructor of the class in JavaScript is always a function that is called with the `new` operator (e.g. `new MyClassConstructor();`). In TRONament, your constructor should add some additional methods to the created object. This can be done by accessing the `this` variable inside the construtor:

```js
tronament.aiModule("example-ai", function() {
    this.somePublicProperty = true;
    var somePrivateProperty = false;

    this.someMethod = function () {
        console.log("Hello, World!");
    }

    var somePrivateMethod = function () {
        console.log("Shhh...");
    }
});
```

Anything set as a property of `this` will be exposed as a public method or variable, while other functions and variables will be kept private. This is important, as A.I.s are not sandboxed and other A.I. programs might be able to access your public properties!

The only method you are required to define in your class is a `move()` method. This method will be automatically called by the game every time your player is moved forward and should return the direction you would like to travel forward to. Depending on the speed of the computer, this could happen many times a second, so be sure you can always return a direction.

### Directions
As you might expect, there are four directions the player can travel. These directions correspond to some constants in the `tronament` namespace and can be returned by your `move()` method to indicate the direction to travel. The directions are:

- `tronament.NORTH`
- `tronament.EAST`
- `tronament.SOUTH`
- `tronament.WEST`

### "Seeing" your way around
It would be pretty pointless to make an A.I. that can't see where it is going! To help with this, TRONament provides a few methods already attached to your A.I. class for interacting with the game. Currently, the methods provided are:

- `queryAbsolute(x, y)`: Queries the game for what is at an absolute location.
- `queryRelative(x, y)`: Queries the game for what is at a location relative to the player's current position.
- `message(string)`: Displays a fun message in the TRONament UI.

These methods are available as part of the `this` variable and are inherited from a base A.I. class.

TRONament intentionally keeps secret the absolute locations of all the players, and you cannot check the location of your own player of of any others. However, you can query a given set of coordinates to check what kind of object is at the location. You can use `queryAbsolute()` to query specific X- and Y-coordinates, but even more useful is `queryRelative()`, which accepts coordinates relative to your current position.

Both of these methods return a bitmask of flags that reveal some information about the contents of the given location. The possible flags are:

- `tronament.EMPTY`: Indicates that the location is empty.
- `tronament.TRAIL`: Indicates the presence of the trail from any player.
- `tronament.OPPONENT`: Indicates a trail of an opposing player.
- `tronament.WALL`: Indicates the location is against the edge of the map.
- `tronament.OUT_OF_BOUNDS`: The space is outside the bounds of the map.

Using these methods should give you everything you need to explore the world around you before making a desicion on which direction to travel in.

## Uses
TRONament is currently a side project for the University of Wisconsin-Whitewater ACM team, but the intention is to create a tournament where players develop an A.I. program and that program can be entered into a ranked competition where multiple programs face-off and compete for first place. It is a fun and easy way to introduce students into machine learning and game programming.

It is also just fun to play and watch!

## License
TRONament is licensed under the MIT license. View the [license file](LICENSE) for details.
