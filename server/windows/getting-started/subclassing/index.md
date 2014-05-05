# Subclassing

Subclassing allows you to extend the core classes of the SDK with your own. While subclassing is not mandatory,
it does make for a more succinct and natural coding experience as shown in the example below.

``` csharp
// Without subclassing.
var player = APObjects.GetAsync("player");
int score = player.Get<int>("score");

// With subclassing
// Player class subclasses APObject.
var player = APObjects.GetAsync("attempt") as Player;
int score = player.Score;

```

## Which types support subclassing ?
Subclassing is fully supported for the `APObject`, `APUser` and `APConnection` types.

## How to create your own sub class.
The following steps explain how to setup subclassing for your app.

### 1. Define your subclass.
Create your own user defined class which extends `APObject`. Use the `Get()` and `Set()` methods
on the base class to define your own strongly typed properties as shown.

``` csharp
public class Player : APObject
{

  public int Score
  {
    get
    {
      int defaultValue = 0;
      return base.Get<int>("score", defaultValue);
    }
    set
    {
      base.Set("score", value);
    }
  }

}

```

### 2. Register the subclass with the SDK.
Register your subclass with the SDK. This will ensure that whenever you request for the
specific object type, the SDK will return the corresponding sub class instance instead of
an APObject.

``` csharp
/// Registering your custom type with the SDK.
/// This example maps subclass Player with the object type "player".
AppContext.Types.MapObjectType<Player>("player");
```
