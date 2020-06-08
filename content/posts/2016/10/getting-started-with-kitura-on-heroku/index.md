---
title: "Getting Started With Kitura on Heroku"
date: 2016-10-31
type: post
---

[Kitura](https://www.kitura.io/) is a web framework created by IBM. It is a really simple framework with more than a passing similarity to frameworks such as Sinatra, Express, Lumen and Flask. It is written in Swift so there are some big draws towards using it as you can start to consider writing both your client code (assuming you are building for iOS and OS X) and server side code in the same language.

This isn’t the first time that we’ve started to see this kind of thing. In the land of browser based applications you’re able to write Javascript in the browser and on the server thanks to tools like NodeJS. On Android thanks to the use of Java you’re able to share code with your backend and your apps (There’s a big win here as the Java ecosystem is absolutely huge).

Personally I started to get really interested in Swift as a server side language with the release of Swift 3 which bundled in the Swift Package Manager (SPM) and a native port of [Foundation](https://github.com/apple/swift-corelibs-foundation). For those of you who aren’t aware Foundation is one of the key frameworks that brought a lot to Objective-C and Swift. Since the original Foundation library was written in Objective-C it was not available to Swift on Linux, but there has now been an effort to re-implement Foundation natively in Swift and it is starting to bear fruit.

---

# Setup

## Swift

For the sake of this write up I’ll assume that you are running on OS X in which case you will want to pop over to the App Store and grab Xcode 8. If you aren’t a fan of the App Store it is also available as a direct download through the Apple Developer Portal.

Getting things setup on Linux is a little more involved but there are some installation steps outlined for you on the [Swift website](https://swift.org/getting-started/#installing-swift).

Once you’ve got everything installed you will be able to run:

<pre>
swift --version
</pre>

This should show you what version of Swift you currently have installed. For this guide I'm assuming you are running Swift 3.0.

## Heroku

Next up you will want to grab the [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-command-line). This will setup everything for you on your machine, I'll assume that you have created an account with Heroku and have logged in using the toolbelt at this point. Don't worry you won't need to create any apps just yet.

---

# Build

Now you’ve got your development environment setup we can get to the fun bit of actually building our application.

First off you will want to create the project structure for your application. Swift Package Manager (SPM) helps you here:

```shell
mkdir myFirstKituraApp
cd myFirstKituraApp
swift package init --type executable
```

This will setup the following standard SPM folder structure for you:

```plain
.
├── .gitignore
├── Package.swift
├── Packages
├── Sources
│   └── main.swift
└── Tests
```

## Xcode

At this point if you are running OS X and Xcode then you can generate an xcodeproj file so that you can get going. If you want to do this you will need to run:

```shell
swift package generate-xcodeproj
```

You will need to run this whenever you update the **Package.swift** file to ensure that you have the latest version of your dependencies available in your project.

## Dependencies

First we need to grab the Kitura dependencies we are going to be using. Open up **Package.swift** and make sure that it looks like the following:

```swift
import PackageDescription

let package = Package(
    name: "myFirstKituraProject",
    dependencies: [
        .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 0),
        .Package(url: "https://github.com/IBM-Swift/HeliumLogger.git", majorVersion: 1, minor: 0),
    ]
)
```

Once that's done run:

```shell
swift package fetch
```

## The app

Now to the meat of the application. Open up **Sources/main.swift** and add the following:

```swift
import Foundation
import Kitura
import HeliumLogger

HeliumLogger.use()

let router = Router()

router.get("/") { request, response, next in
    response.send("Hello world")
    next()
}

// Resolve the port that we want the server to listen on
let port = Int(ProcessInfo.processInfo.environment["PORT"] ?? "8080")

Kitura.addHTTPServer(onPort: port, with: router)

Kitura.run()
```

## Version control

Heroku requires that your app is managed by `git` before you deploy it. So we will need to get this all under version control:

```shell
git init
git add .
git commit -m 'Initial commit'
```

Once you are done you can try this out on the command line or by running it from Xcode. To run this app from the command line you will need to run:

```shell
swift build
```

This will build and package your application for you. Once the process is complete you can run it with:

```shell
.build/debug/myFirstKituraProject
```

Now point your browser at [http://localhost:8080](http://localhost:8080) and you should see something like the following:

{{<figure src="hello-world.png" title="Your new Kitura app running in the browser!">}}

## Deployment

Now we'll get ready to release your project to the world using Heroku.

First create a new file called **Procfile** in the root of your project and add the following to it:

```plain
web: myFirstKituraProject
```

Next up you will want to run the following command to create a new Swift application:

```shell
heroku create --buildpack https://github.com/kylef/heroku-buildpack-swift.git
```

This command uses a custom buildpack that includes Swift 3.0 (the current stable version). You might be interested in taking a look at the repository so that you can see what’s involved in creating a custom buildpack.

Once this command has run you now should have an application on your account. Don’t worry if you are running this on the free tier that should be more than enough to run this app.

Now to push your application:

```shell
git push heroku master
```

This command will take a small amout of time while the slug is built for your application. It needs to fetch your dependencies and compile it for the Ubuntu Linux OS running your slig.

Once completed you can view your new application by running:

```shell
heroku open
```

That's it you're running your new application on Heroku. Go and build something great!
